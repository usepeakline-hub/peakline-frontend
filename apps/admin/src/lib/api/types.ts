/**
 * Response shapes for the backend's `/docs-json` DTOs (NestJS/Swagger,
 * `https://peak.usepeakline.com/docs`) — auth + the Admin surface this app
 * actually calls, added as each phase needs them rather than mirrored in
 * full up front. Request payload shapes are typed inline where they're
 * built, matching apps/web's own convention.
 */

/** Every successful response's envelope shape. */
export interface ApiSuccessResponse<T = unknown> {
	statusCode: number;
	message: string;
	timestamp: string;
	data: T;
}

/** A NestJS default-exception-filter error body — `message` can be a single
 * string or (from class-validator) an array of them; `code` is only present
 * on some errors. Same shape apps/web already confirmed live. */
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
}

/** `/auth/login` returns this instead of `AuthTokensData` when the account
 * has 2FA enabled — confirmed against the real spec's own description of
 * `VerifyMfaDto.mfaToken` ("Short-lived MFA token returned from login"),
 * even though the endpoint's documented 200 schema only shows
 * `AuthTokensDto`. Distinguish the two by whether `accessToken` is present. */
export interface MfaRequiredData {
	mfaToken: string;
}

export type LoginResponseData = AuthTokensData | MfaRequiredData;

export function isMfaRequired(data: LoginResponseData): data is MfaRequiredData {
	return !("accessToken" in data);
}

/** `staffRole` is only ever populated for `role: "staff"` accounts — the
 * only kind of account this app should ever let in (see `useStaffGate`). */
export type StaffRole = "admin" | "super_admin" | "support" | "compliance" | "operations";

/** Trimmed to the fields this app actually reads — the real `AdminUserDto`
 * carries far more (lock/pin/session metadata), added here once a screen
 * needs it. */
export interface AdminSelfData {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: "staff" | "customer";
	staffRole: StaffRole | null;
}

export interface PaginationMeta {
	totalCount: number;
	pageCount: number;
	currentPage: number;
	limit: number;
	prevPage: boolean;
	nextPage: boolean;
}

export interface PaginatedResponse<T> {
	statusCode: number;
	message: string;
	timestamp: string;
	data: T[];
	meta: PaginationMeta;
}

/** `GET /admin/analytics/overview` — platform-wide totals for the dashboard
 * home. Amount fields are decimal strings (ledger precision), not numbers —
 * parse with `Number()` before formatting, same convention as apps/web's
 * own `BalanceData`. */
export interface AdminOverviewData {
	totalUsers: number;
	totalMerchants: number;
	totalDeposits: string;
	totalWithdrawals: string;
	totalInternalTransfers: string;
	totalVolume: string;
	activePaymentLinks: number;
	pendingFundingIntents: number;
	totalFeeIncome: string;
}
