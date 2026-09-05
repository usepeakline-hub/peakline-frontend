"use client";

import { useEffect } from "react";
import { PartyPopper } from "lucide-react";
import { Button } from "@repo/ui/button";
import { toast } from "@repo/ui/sonner";
import { useSignUpFlowStore } from "@/lib/stores/signUpFlowStore";
import { usePersonalInfoFlowStore } from "@/lib/stores/personalInfoFlowStore";

/**
 * End of Sign Up — wallet's created, PIN's set. Clears the flow stores on
 * arrival since nothing after this point needs them.
 *
 * NOTE: Figma node 127:3467 for this screen couldn't be fetched — Figma's
 * API rate-limited this session (a plan-level cap, not transient). Built to
 * a conventional success-screen pattern instead; flag anything that should
 * change once that's verified.
 */
function SuccessForm() {
	const resetSignUpFlow = useSignUpFlowStore((state) => state.reset);
	const resetPersonalInfoFlow = usePersonalInfoFlowStore(
		(state) => state.reset,
	);

	useEffect(() => {
		resetSignUpFlow();
		resetPersonalInfoFlow();
		// Runs once, on arrival — the setters are stable zustand references.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function handleGoToDashboard() {
		// TODO: route into apps/dashboard once it's scaffolded.
		toast.info("The dashboard isn't built yet");
	}

	return (
		<div className="flex flex-col items-center gap-8 text-center">
			<span className="flex size-20 items-center justify-center rounded-full bg-primary-500/10">
				<PartyPopper className="size-9 text-primary-500" aria-hidden="true" />
			</span>

			<div className="flex flex-col gap-2">
				<h1 className="text-h4 sm:text-h3 text-foreground">
					Wallet created!
				</h1>
				<p className="text-sm sm:text-b1 text-muted-foreground">
					You&apos;re all set. Start sending, receiving and paying securely
					with Peakline.
				</p>
			</div>

			<Button
				type="button"
				size="large"
				className="w-full"
				onClick={handleGoToDashboard}
			>
				Go to Dashboard
			</Button>
		</div>
	);
}

export { SuccessForm };
