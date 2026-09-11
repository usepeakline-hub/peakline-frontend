import axios, {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/lib/stores/authStore";
import { apiRoutes } from "@/lib/config/apiRoutes";
import type { ApiSuccessResponse, AuthTokensData } from "@/lib/api/types";

// Same-origin proxy (see src/app/api/proxy/[...path]/route.ts) — the real
// API host and the `peakline-ref` app-key it requires both live server-side
// only. The browser never talks to the Railway host directly.
const PROXY_BASE_URL = "/api/proxy";

// Longer than the proxy route's own `UPSTREAM_TIMEOUT_MS` (20s) on purpose —
// that timeout should always fire first and hand back a real, backend-shaped
// 504 body (see route.ts's own note), with this one only as a last-resort
// backstop for the proxy itself hanging (a dev-server stall, a runaway
// request that never reaches the try/catch). Either way, no request is
// allowed to sit in "loading" forever — every one of them settles, one way
// or another, within this window.
const REQUEST_TIMEOUT_MS = 25_000;

// No auth header — for register/login/verify-email/resend-otp, and for the
// token refresh call itself (must not go through axiosAuth, or a failed
// refresh would loop).
export const axiosPublic = axios.create({
	baseURL: PROXY_BASE_URL,
	headers: { "Content-Type": "application/json" },
	timeout: REQUEST_TIMEOUT_MS,
});

// Attaches the bearer token and retries once with a refreshed token on 401.
export const axiosAuth = axios.create({
	baseURL: PROXY_BASE_URL,
	headers: { "Content-Type": "application/json" },
	timeout: REQUEST_TIMEOUT_MS,
});

// ---------------------------------------------------------------------
// Console logging for every API call, success or error — every request
// this app makes goes through axiosPublic/axiosAuth, so hooking logging in
// here covers the whole app. Useful for catching real backend bugs (500s,
// unexpected validation errors) without digging through the Network tab.
// ---------------------------------------------------------------------
type TimedConfig = InternalAxiosRequestConfig & { __startedAt?: number };

const REDACTED_KEYS = ["password", "confirmPassword", "pin", "confirmPin"];

// Don't print raw passwords/PINs to the console even though this is
// dev-facing logging.
const redact = (data: unknown) => {
	if (!data || typeof data !== "object") return data;

	const clone = { ...(data as Record<string, unknown>) };
	for (const key of REDACTED_KEYS) {
		if (key in clone) clone[key] = "••••••";
	}
	return clone;
};

// Registered as the *first* interceptor on each instance (attached right
// after axios.create, before the auth/refresh interceptors below) so it
// sits innermost: it sees and logs the original request/response of every
// HTTP call axios actually makes, including a 401 that later gets silently
// retried after a token refresh — that retry is a separate logged call,
// rather than the 401 being swallowed and never logged at all.
const attachApiLogging = (instance: AxiosInstance, label: string) => {
	instance.interceptors.request.use((config) => {
		(config as TimedConfig).__startedAt = Date.now();
		// Logged on the way out, not just on response — a request that's
		// hanging (dropped connection, an upstream that never answers) would
		// otherwise leave no trace at all until/unless it eventually times
		// out. Seeing this line with no matching response/error line below it
		// yet is itself the signal that something is actually stuck, rather
		// than a query just sitting disabled or never having fired.
		console.log(
			`%c[api:${label}] -> ${(config.method ?? "get").toUpperCase()} ${config.url}`,
			"color:#9B9B9B",
		);
		return config;
	});

	instance.interceptors.response.use(
		(response) => {
			const config = response.config as TimedConfig;
			const duration = config.__startedAt ? Date.now() - config.__startedAt : undefined;

			console.groupCollapsed(
				`%c[api:${label}] <- %c${response.status} %c${(config.method ?? "get").toUpperCase()} ${config.url}%c ${duration ?? "?"}ms`,
				"color:#9B9B9B",
				"color:#16a34a;font-weight:600",
				"color:inherit",
				"color:#9B9B9B",
			);
			if (config.data) console.log("request:", redact(config.data));
			if (config.params) console.log("params:", config.params);
			console.log("response:", response.data);
			console.groupEnd();

			return response;
		},
		(error: AxiosError) => {
			const config = error.config as TimedConfig | undefined;
			const duration = config?.__startedAt ? Date.now() - config.__startedAt : undefined;
			const status = error.response?.status;
			// No `status` at all means the request never got a response —
			// either it timed out client-side (`ECONNABORTED`, past
			// `REQUEST_TIMEOUT_MS`) or failed outright (offline, DNS, CORS).
			// Called out explicitly rather than just logging "ERR", since
			// this is exactly the "stuck in loading" case: the query/mutation
			// is about to settle into an error state instead of hanging
			// forever, and this line is the only place that says why.
			const isTimeout = !error.response && error.code === "ECONNABORTED";
			const isNetworkError = !error.response && !isTimeout;
			const kind = isTimeout ? "TIMEOUT" : isNetworkError ? "NETWORK" : String(status ?? "ERR");

			// 4xx are expected, user-facing failures (bad credentials, failed
			// validation, etc.) — log those as a warning so they don't trip
			// Next's dev-mode Console Error overlay on every wrong-password
			// attempt. Real bugs (5xx, timeouts, network errors with no
			// response at all) still get the full console.error treatment.
			const isClientError = typeof status === "number" && status >= 400 && status < 500;
			const log = isClientError ? console.warn : console.error;

			console.groupCollapsed(
				`%c[api:${label}] xx %c${kind} %c${(config?.method ?? "?").toUpperCase()} ${config?.url ?? "unknown"}%c ${duration ?? "?"}ms`,
				"color:#9B9B9B",
				isClientError ? "color:#d97706;font-weight:600" : "color:#dc2626;font-weight:600",
				"color:inherit",
				"color:#9B9B9B",
			);
			if (config?.data) console.log("request:", redact(config.data));
			if (config?.params) console.log("params:", config.params);
			log(
				`[api:${label}] ${kind} ${(config?.method ?? "?").toUpperCase()} ${config?.url ?? "unknown"} (${duration ?? "?"}ms) — error:`,
				error.response?.data ?? error.message,
			);
			console.groupEnd();

			return Promise.reject(error);
		},
	);
};

attachApiLogging(axiosPublic, "public");
attachApiLogging(axiosAuth, "auth");

axiosAuth.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// Shared across concurrent 401s so a burst of requests triggers one refresh
// call instead of one per request.
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
	const refreshToken = useAuthStore.getState().refreshToken;

	if (!refreshToken) return null;

	try {
		const { data } = await axiosPublic.post<ApiSuccessResponse<AuthTokensData>>(
			apiRoutes.auth.REFRESH,
			{ refreshToken },
		);

		useAuthStore.getState().setTokens(data.data);
		return data.data.accessToken;
	} catch {
		// The refresh token itself was rejected — expired, or already
		// consumed by a previous rotation, which the backend treats as a
		// theft signal and revokes the whole family. Nothing left to retry
		// with.
		useAuthStore.getState().clear();
		return null;
	}
};

axiosAuth.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as
			| (InternalAxiosRequestConfig & { _retry?: boolean })
			| undefined;

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			refreshPromise ??= refreshAccessToken().finally(() => {
				refreshPromise = null;
			});

			const newToken = await refreshPromise;

			if (newToken) {
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return axiosAuth(originalRequest);
			}

			if (typeof window !== "undefined") {
				// A plain axios interceptor, not a React component — there's no
				// `useRouter()` available here, so a full navigation is the only
				// option.
				// eslint-disable-next-line @next/next/no-location-assign-relative-destination
				window.location.href = "/auth/sign-in";
			}
		}

		return Promise.reject(error);
	},
);
