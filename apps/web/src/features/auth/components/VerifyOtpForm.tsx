"use client";

import { useRouter } from "next/navigation";
import { useVerifyOtp } from "@/features/auth/hooks";
import { useSignUpFlowStore } from "@/lib/stores/signUpFlowStore";
import { VerifyCodeForm } from "@/features/auth/components/VerifyCodeForm";

/**
 * Right after Sign Up, before Account Type: Sign Up -> Verify -> Account
 * Type -> [Merchant Setup, merchant only] -> Personal Details -> Wallet
 * Created. Verifies the email address from Sign Up, not the phone number
 * (Figma node 127:2709, "Verify your email" — the phone collected earlier
 * is for contact/SMS elsewhere, not this code).
 */
function VerifyOtpForm() {
	const router = useRouter();
	const email = useSignUpFlowStore((state) => state.email) || "your email";
	const verifyOtp = useVerifyOtp();

	return (
		<VerifyCodeForm
			method="email"
			destination={email}
			submitLabel="Verify email"
			isPending={verifyOtp.isPending}
			onSubmit={(values) =>
				verifyOtp.mutate(
					{ ...values, email },
					{ onSuccess: () => router.push("/auth/sign-up/account-type") },
				)
			}
		/>
	);
}

export { VerifyOtpForm };
