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
 * update), but our own form always collects and sends all four. A separate
 * `POST /onboarding/merchant` now also exists — not yet reconciled with
 * this one + the standalone `POST /businesses` call `useCompleteSignUp`
 * currently makes for merchant accounts; needs its own look before
 * switching over. */
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

/** `GET /users/me`. Real account fields — `PATCH /users/me` only accepts a
 * subset of these (see `UpdateProfileFieldsDto`); email/phone changes have
 * no endpoint yet ("go through a separate verified-change flow" per the
 * docs, not shipped). */
export interface ProfileData {
	id: string;
	firstName: string;
	lastName: string;
	otherName?: string | null;
	email: string;
	phoneNumber: string;
	countryCode: string;
	nationality?: string | null;
	dateOfBirth?: string | null;
	residentialAddress?: string | null;
	city?: string | null;
	customerType?: CustomerType | null;
	kycTier: number;
	username?: string | null;
	avatarUrl?: string | null;
	emailVerifiedAt?: string | null;
	phoneVerifiedAt?: string | null;
	deletionRequestedAt?: string | null;
	deletionScheduledAt?: string | null;
	createdAt: string;
}

/** Fields `PATCH /users/me` actually accepts — a subset of `ProfileData`. */
export interface UpdateProfileFieldsData {
	firstName?: string;
	lastName?: string;
	otherName?: string;
	username?: string;
	avatarUrl?: string;
}

/** `POST/DELETE /users/me/deletion-request`. */
export interface AccountDeletionStatusData {
	deletionRequestedAt: string | null;
	deletionScheduledAt: string | null;
	graceDays: number;
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

/** The `meta` sibling to `data` on every paginated list endpoint
 * (notifications, transactions). */
export interface PaginationMeta {
	totalCount: number;
	pageCount: number;
	currentPage: number;
	limit: number;
	prevPage: boolean;
	nextPage: boolean;
}

/** `GET /notifications`. `readAt` is `null`/absent until
 * `PATCH /notifications/{id}/read`, then an ISO timestamp — used as the
 * unread indicator rather than a separate boolean. */
export interface NotificationData {
	id: string;
	userId: string;
	businessId?: string | null;
	type: string;
	title: string;
	body: string;
	data?: Record<string, unknown> | null;
	readAt?: string | null;
	createdAt: string;
	updatedAt: string;
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

/** A single money-with-comparison figure — `totalReceived`/`todaysPayments`
 * on `MerchantDashboardStatsData`. `amount` is a decimal string; `changePct`
 * is `null` when the comparison baseline was 0. `changeVsLabel` is a
 * snake_case label ("previous_month", "yesterday") describing what it's
 * compared against — not an enum the docs pin down, so treated as an
 * arbitrary string and humanized at render time rather than mapped 1:1. */
export interface DashboardMoneyData {
	amount: string;
	currency: string;
	changePct: number | null;
	changeVsLabel: string;
}

export interface DashboardPendingData {
	amount: string;
	currency: string;
	count: number;
}

export interface DashboardBucketData {
	label: string;
	value: string;
}

export interface DashboardChartData {
	period: "year" | "month" | "week";
	currency: string;
	total: string;
	buckets: DashboardBucketData[];
}

/** `GET /merchant/dashboard/stats` — one call covers both Overview's three
 * stat cards (`totalReceived`/`todaysPayments`/`pending`) and the Total
 * Received chart (`chart`, shaped by the `period` query param); the
 * `period` param only changes `chart` — the other three fields reflect the
 * same all-time/today/pending totals regardless of it. */
export interface MerchantDashboardStatsData {
	totalReceived: DashboardMoneyData;
	todaysPayments: DashboardMoneyData;
	pending: DashboardPendingData;
	chart: DashboardChartData;
}

export interface PaymentLinkBusinessData {
	id: string;
	name: string;
}

/** No "paid" state — a link's derived status only ever tracks whether it
 * can still be used (active), has timed out (expired), or was explicitly
 * cancelled. Whether it's actually been paid is a property of the deposit
 * transaction made against it, not of the link itself. */
export type PaymentLinkStatus = "active" | "expired" | "cancelled";

/** `POST/GET /payment-links`, `GET /payment-links/{id}`,
 * `POST /payment-links/{id}/cancel`. */
export interface PaymentLinkData {
	id: string;
	title: string;
	/** Decimal string, e.g. "500.00". */
	amount: string;
	currency: "USDC";
	description?: string | null;
	customerReference?: string | null;
	expiresAt: string;
	cancelledAt?: string | null;
	status: PaymentLinkStatus;
	/** The URL slug and the Stellar text memo a payer must attach — same
	 * value, two purposes. */
	publicCode: string;
	/** Full shareable URL, ready to use as-is. */
	url: string;
	business: PaymentLinkBusinessData;
	createdAt: string;
	updatedAt: string;
}

/** `GET /payment-links/stats` — the three header cards on the Payment
 * Links page. */
export interface PaymentLinkStatsData {
	total: number;
	active: number;
	expired: number;
	cancelled: number;
}

/** `GET /pay/{code}` — public, no auth. Everything a payer needs to
 * complete payment themselves (destination wallet + the memo that must
 * accompany the Stellar transfer for it to be matched to this link). */
export interface PublicPaymentLinkData {
	title: string;
	amount: string;
	currency: "USDC";
	description?: string | null;
	expiresAt: string;
	status: PaymentLinkStatus;
	businessName: string;
	destinationAddress: string;
	memo: string;
}

/** `internal` = pure ledger transfer between Peakline users, settled
 * instantly with no on-chain fee. `external` = an on-chain Stellar send to
 * a non-Peakline address. */
export type TransferType = "internal" | "external";

/** `POST /transfers/send`'s own response — a synchronous result, not a
 * "queued" one (no `status` field here, unlike `TransferStatusData`). */
export interface SendMoneyResponseData {
	transactionId: string;
	type: TransferType;
	amount: string;
	currency: string;
	/** Null for internal transfers. */
	stellarTxHash?: string | null;
	/** Whichever identifier (username/phone/truncated wallet address) was
	 * used to resolve the recipient — there's no directory lookup that
	 * returns an actual name. */
	recipientLabel: string;
}

export type TransferStatus = "pending" | "processing" | "completed" | "failed" | "reversed";

export interface TransferRecipientData {
	name?: string | null;
	phone?: string | null;
	username?: string | null;
	walletAddress?: string | null;
}

/** `GET /transfers/{id}` — not wired to any UI yet; nothing currently shows
 * a transfer's detail-by-id (same gap as `transactions.byId`, which this
 * would need reconciling with — a real ledger record, not the app's own
 * named-counterparty `Transaction` shape). */
export interface TransferStatusData {
	transactionId: string;
	status: TransferStatus;
	type: TransferType;
	amount: string;
	currency: string;
	fee: string;
	fxEquivalent?: string | null;
	stellarTxHash?: string | null;
	recipient: TransferRecipientData;
	newBalance: string;
	newBalanceFxEquivalent?: string | null;
	note?: string | null;
	createdAt: string;
	completedAt?: string | null;
}
