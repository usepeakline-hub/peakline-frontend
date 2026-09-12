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
// only. The browser never talks to the backend directly. Mirrors apps/web's
// own lib/config/axios.ts — same logging/timeout conventions, so a stuck
// request or a real backend bug shows up here exactly the way it already
// does over there.
const PROXY_BASE_URL = "/api/proxy";

// Longer than the proxy route's own `UPSTREAM_TIMEOUT_MS` (20s) on purpose —
// that timeout should always fire first and hand back a real, backend-shaped
// 504 body, with this one only as a last-resort backstop for the proxy
// itself hanging. No request is allowed to sit in "loading" forever.
const REQUEST_TIMEOUT_MS = 25_000;

// No auth header — login, and the token refresh call itself (must not go
// through axiosAuth, or a failed refresh would loop).
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
// here covers the whole app.
// ---------------------------------------------------------------------
type TimedConfig = InternalAxiosRequestConfig & { __startedAt?: number };

const REDACTED_KEYS = ["password", "totpCode", "temporaryPassword"];

const redact = (data: unknown) => {
	if (!data || typeof data !== "object") return data;

	const clone = { ...(data as Record<string, unknown>) };
	for (const key of REDACTED_KEYS) {
		if (key in clone) clone[key] = "••••••";
	}
	return clone;
};

const attachApiLogging = (instance: AxiosInstance, label: string) => {
	instance.interceptors.request.use((config) => {
		(config as TimedConfig).__startedAt = Date.now();
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
			const isTimeout = !error.response && error.code === "ECONNABORTED";
			const isNetworkError = !error.response && !isTimeout;
			const kind = isTimeout ? "TIMEOUT" : isNetworkError ? "NETWORK" : String(status ?? "ERR");

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
				window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	},
);
