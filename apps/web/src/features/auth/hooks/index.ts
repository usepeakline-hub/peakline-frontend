import { useMutation } from "@tanstack/react-query";
import type {
	SignInValues,
	SignUpValues,
	AccountTypeValues,
	MerchantSetupValues,
	VerifyOtpValues,
	PersonalDetailsValues,
	IdVerificationValues,
	SetPinValues,
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

export {
	useSignIn,
	useSignUp,
	useSubmitAccountType,
	useSubmitMerchantSetup,
	useVerifyOtp,
	useCompleteSignUp,
	useSetupWallet,
};
