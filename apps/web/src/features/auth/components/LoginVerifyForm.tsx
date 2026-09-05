"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@repo/ui/sonner";
import { useVerifyLogin } from "@/features/auth/hooks";
import { useLoginFlowStore } from "@/lib/stores/loginFlowStore";
import { VerifyCodeForm } from "@/features/auth/components/VerifyCodeForm";

/**
 * Final step of every login, once a 2FA method has been chosen (Figma node
 * 127:2709 — the same "Verify" frame Sign Up uses, hence the shared
 * `VerifyCodeForm`). Neither `dashboard` nor `merchant` is scaffolded yet,
 * so success here is a stub.
 */
function LoginVerifyForm() {
	const router = useRouter();
	const email = useLoginFlowStore((state) => state.email);
	const method = useLoginFlowStore((state) => state.twoFactorMethod);
	const resetLoginFlow = useLoginFlowStore((state) => state.reset);
	const verifyLogin = useVerifyLogin();

	// Reached without a chosen 2FA method in this session — send them back.
	useEffect(() => {
		if (!email || !method) {
			router.replace("/auth/sign-in");
		}
	}, [email, method, router]);

	if (!email || !method) return null;

	function handleGoToDashboard() {
		resetLoginFlow();
		// TODO: route into apps/dashboard once it's scaffolded.
		toast.info("The dashboard isn't built yet");
	}

	return (
		<VerifyCodeForm
			method={method}
			destination={email}
			submitLabel="Verify"
			isPending={verifyLogin.isPending}
			onSubmit={(values) =>
				verifyLogin.mutate(
					{ ...values, email },
					{ onSuccess: handleGoToDashboard },
				)
			}
		/>
	);
}

export { LoginVerifyForm };
