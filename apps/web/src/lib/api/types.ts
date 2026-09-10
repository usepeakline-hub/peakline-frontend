/**
 * Response shapes for the backend's `/docs-json` DTOs (NestJS/Swagger,
 * `https://peakline-backend-production.up.railway.app/docs`) — auth module
 * only, for now. Request payload shapes are typed inline where they're
 * built (see `features/auth/hooks/index.ts`) rather than mirrored here,
 * matching how the sibling med-archive client project splits these.
 */

/** Every successful response's envelope shape. */
export interface ApiSuccessResponse<T = unknown> {
	statusCode: number;
	message: string;
	timestamp: string;
	data: T;
}

/** A NestJS default-exception-filter error body, confirmed live against the
 * real backend — `message` can be a single string or (from class-validator)
 * an array of them; `code` is only present on some errors (e.g.
 * "INVALID_CREDENTIALS" on a bad login) and absent on others. */
export interface ApiErrorResponse {
	statusCode: number;
	error?: string;
	message?: string | string[];
	code?: string;
	path?: string;
	timestamp?: string;
}

export interface AuthTokensData {
	/** Short-lived JWT — send as `Authorization: Bearer <accessToken>`. */
	accessToken: string;
	/** Long-lived, single-use. Reusing a consumed one revokes the whole
	 * token family (all devices), so always persist the newest one and
	 * never retry a request with a stale one. */
	refreshToken: string;
	/** Access token lifetime, in seconds. */
	expiresIn: number;
	tokenType: "Bearer";
	/** Not live yet as of this writing (still absent from `/docs-json`) —
	 * the backend team says both are being added to the login/verify-email
	 * response. Optional so this type keeps working either way; once
	 * present, `authStore.setTokens` uses these directly instead of falling
	 * back to its own client-side customerType cache (see that store's own
	 * note on why that cache exists at all). */
	customerType?: CustomerType;
	userRole?: UserRole;
}

/** Returned by `/auth/register` and `/auth/resend-otp`. */
export interface OtpSentData {
	ttlSeconds: number;
}

export type OtpPurpose =
	| "email_verification"
	| "phone_verification"
	| "password_reset";

export type CustomerType = "individual" | "merchant";

/** "staff" covers admin/super_admin-style backend roles (see
 * `PATCH /config/stellar/stage`'s "admin or super_admin staff role"
 * requirement) — there's no admin app in the MVP (CLAUDE.md), so this isn't
 * acted on anywhere yet, just captured since it now rides along on login. */
export type UserRole = "staff" | "customer";

/** `POST /onboarding/individual` — all fields optional on the wire (partial
 * update), but our own form always collects and sends all four. Serves
 * both individual and merchant account types; there's no separate
 * onboarding endpoint for Business Information yet. */
export interface UpdateProfileData {
	/** "YYYY-MM-DD". */
	dateOfBirth?: string;
	/** ISO 3166-1 alpha-2, e.g. "GH" — not a display name. */
	nationality?: string;
	residentialAddress?: string;
	city?: string;
}

export interface SetPinData {
	pin: string;
}

/** `POST/GET /wallets/stellar`. */
export interface StellarWalletData {
	id: string;
	walletType: CustomerType;
	network: "mainnet" | "testnet";
	publicKey: string;
	label?: string | null;
	federationAddress?: string | null;
	deactivatedAt?: string | null;
	createdAt: string;
}

/** `POST/GET/PATCH /businesses`. `status` and the nullable fields are typed
 * loosely (`docs-json` itself only says `"type": "object"` for most of
 * them, likely a Swagger-decorator gap rather than an intentional shape) —
 * widen these once the real values are seen live. */
export interface BusinessData {
	id: string;
	ownerId: string;
	name: string;
	category: string;
	status: string;
	country: string;
	city?: string | null;
	address?: string | null;
	phone?: string | null;
	website?: string | null;
	logoUrl?: string | null;
	description?: string | null;
	registrationNumber?: string | null;
	taxId?: string | null;
	verifiedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

/** `GET /transactions/balances` — one entry per currency the account has
 * ever held (not necessarily both USDC and GHS present). `balance` is a
 * decimal string (Stellar/ledger precision), not a number — parse with
 * `Number()` before formatting. */
export interface BalanceData {
	currency: string;
	balance: string;
}

/** `POST /auth/2fa/enroll` — shown once; the recovery codes can't be
 * fetched again after this response. */
export interface EnrollTotpData {
	/** Base64 data URL — render directly in an `<img>`. */
	qrCodeDataUrl: string;
	/** Raw otpauth:// URI, for manual entry when the app can't scan. */
	otpAuthUri: string;
	recoveryCodes: string[];
}
