import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@repo/ui/sonner";
import type {
	SignInValues,
	SignUpValues,
	AccountTypeValues,
	MerchantSetupValues,
	VerifyOtpValues,
	PersonalDetailsValues,
	IdVerificationValues,
	SetPinValues,
	TwoFactorMethodValues,
	ForgotPasswordValues,
	ResetPasswordValues,
} from "@/lib/validations/authValidations";

// TODO: replace with real calls into the auth API once it exists.
async function fakeRequest<T>(payload: T, delay = 800): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, delay));
	return payload;
}

function useSignIn() {
	return useMutation({
		mutationFn: (values: SignInValues) => fakeRequest(values),
	});
}

function useSignUp() {
	return useMutation({
		mutationFn: (values: SignUpValues) => fakeRequest(values),
	});
}

function useSubmitAccountType() {
	return useMutation({
		mutationFn: (values: AccountTypeValues) => fakeRequest(values),
	});
}

function useSubmitMerchantSetup() {
	return useMutation({
		mutationFn: (values: MerchantSetupValues) => fakeRequest(values),
	});
}

function useVerifyOtp() {
	return useMutation({
		mutationFn: (values: VerifyOtpValues & { email: string }) =>
			fakeRequest(values),
	});
}

/**
 * Review's final submit — Personal Information and ID Verification are only
 * collected locally (`usePersonalInfoFlowStore`) until this point, where the
 * whole sign-up (account + profile + KYC doc) is meant to actually go to the
 * backend and the user is considered logged in.
 */
function useCompleteSignUp() {
	return useMutation({
		mutationFn: (
			values: PersonalDetailsValues & IdVerificationValues,
		) => fakeRequest(values),
	});
}

/** First-login step: setting the transaction PIN is what triggers wallet
 * generation server-side, per the brief. */
function useSetupWallet() {
	return useMutation({
		mutationFn: (values: Pick<SetPinValues, "pin">) => fakeRequest(values),
	});
}

function useSubmitTwoFactorMethod() {
	return useMutation({
		mutationFn: (values: TwoFactorMethodValues) => fakeRequest(values),
	});
}

/** Every login's final step — verifying the 2FA code, whichever method was
 * chosen. Distinct from `useVerifyOtp` (Sign Up's email verification) since
 * this can be an authenticator code instead of a mailed one. */
function useVerifyLogin() {
	return useMutation({
		mutationFn: (values: VerifyOtpValues & { email: string }) =>
			fakeRequest(values),
	});
}

function useForgotPassword() {
	return useMutation({
		mutationFn: (values: ForgotPasswordValues) => fakeRequest(values),
	});
}

function useResetPassword() {
	return useMutation({
		mutationFn: (values: ResetPasswordValues & { token: string | null }) =>
			fakeRequest(values),
	});
}

/**
 * Shared by the desktop Sidebar and the mobile Profile page (the two places
 * Logout lives — deliberately not in the primary bottom nav, see
 * `BottomTabBar`'s own note). No real session to tear down yet, so this
 * just clears cached query data (so a future sign-in doesn't flash stale
 * data from this session) and sends the user back to Sign In.
 */
function useLogout() {
	const router = useRouter();
	const queryClient = useQueryClient();

	return function logout() {
		queryClient.clear();
		toast.success("You've been logged out");
		router.push("/auth/sign-in");
	};
}

export {
	useSignIn,
	useSignUp,
	useSubmitAccountType,
	useSubmitMerchantSetup,
	useVerifyOtp,
	useCompleteSignUp,
	useSetupWallet,
	useSubmitTwoFactorMethod,
	useVerifyLogin,
	useForgotPassword,
	useResetPassword,
	useLogout,
};
