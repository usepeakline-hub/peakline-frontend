/**
 * Real backend paths, forwarded verbatim by the same-origin proxy
 * (`src/app/api/proxy/[...path]/route.ts`), so these already include the
 * `/api/v1` prefix the actual API expects.
 */
export const apiRoutes = {
	health: "/api/v1/health",

	auth: {
		REGISTER: "/api/v1/auth/register",
		LOGIN: "/api/v1/auth/login",
		REFRESH: "/api/v1/auth/refresh",
		VERIFY_EMAIL: "/api/v1/auth/verify-email",
		RESEND_OTP: "/api/v1/auth/resend-otp",
		CUSTOMER_TYPE: "/api/v1/auth/customer-type",
		LOGOUT: "/api/v1/auth/logout",
		LOGOUT_ALL: "/api/v1/auth/logout-all",
	},

	// TOTP (authenticator-app) 2FA — account-settings enroll/confirm/disable
	// are wired to these (see features/profile/hooks); VERIFY/RECOVER are the
	// login-flow's own counterparts, not yet wired (the sign-in 2FA screens
	// still predate this endpoint group — a method-picker with an email
	// option this backend has no equivalent for, so that flow needs its own
	// pass rather than a drop-in swap).
	twoFactor: {
		ENROLL: "/api/v1/auth/2fa/enroll",
		CONFIRM: "/api/v1/auth/2fa/confirm",
		DISABLE: "/api/v1/auth/2fa",
		VERIFY: "/api/v1/auth/2fa/verify",
		RECOVER: "/api/v1/auth/2fa/recover",
	},

	// Personal Information's real counterpart — serves both individual and
	// merchant account types (Business Information still has no endpoint of
	// its own). GET is there for "review before submission" but isn't used
	// yet — Review already has the values from the form itself.
	onboarding: {
		INDIVIDUAL: "/api/v1/onboarding/individual",
	},

	users: {
		ME: "/api/v1/users/me",
		ME_DELETION_REQUEST: "/api/v1/users/me/deletion-request",
		PIN: "/api/v1/users/pin",
		PIN_CONFIRM: "/api/v1/users/pin/confirm",
	},

	wallets: {
		STELLAR: "/api/v1/wallets/stellar",
	},

	// Merchant-only. `verify`/`suspend`/`reactivate`/`status-history` are
	// admin/staff-only (no admin app exists per CLAUDE.md) — not called from
	// here.
	businesses: {
		BASE: "/api/v1/businesses",
		byId: (id: string) => `/api/v1/businesses/${id}`,
	},

	// A generic wallet ledger (deposit/withdrawal/internal_transfer/
	// conversion/withdrawal_ghs) — a different shape than the app's own
	// `Transaction` type (built around a named counterparty and a QR/Link
	// payment method neither this list nor its detail record has any
	// equivalent for). Only BALANCES is wired so far (see
	// `useWalletBalance`); LIST/byId are real endpoints but not yet
	// connected to any UI pending a decision on how to reconcile the two
	// shapes.
	transactions: {
		LIST: "/api/v1/transactions",
		BALANCES: "/api/v1/transactions/balances",
		byId: (id: string) => `/api/v1/transactions/${id}`,
	},

	// STREAM (SSE) isn't wired — the notifications panel polls/refetches
	// instead (see useNotifications), same "real data, simpler transport"
	// tradeoff as everywhere else fake-polling stood in for a live feed.
	notifications: {
		LIST: "/api/v1/notifications",
		READ_ALL: "/api/v1/notifications/read-all",
		STREAM: "/api/v1/notifications/stream",
		byIdRead: (id: string) => `/api/v1/notifications/${id}/read`,
		byId: (id: string) => `/api/v1/notifications/${id}`,
	},
};
