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
		PIN: "/api/v1/users/pin",
		PIN_CONFIRM: "/api/v1/users/pin/confirm",
	},

	wallets: {
		STELLAR: "/api/v1/wallets/stellar",
	},
};
