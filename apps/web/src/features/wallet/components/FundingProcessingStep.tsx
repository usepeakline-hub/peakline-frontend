"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useProcessFunding } from "@/features/wallet/hooks";
import type { FundWalletValues } from "@/lib/validations/walletValidations";
import { formatUsdc } from "@/lib/currency";

interface FundingProcessingStepProps {
	values: FundWalletValues;
	onSettled: (result: "success" | "failed") => void;
}

/** Step 3 — fires the actual (fake) funding request on mount and reports
 * back once it settles. No back button and no close button on the dialog
 * for this step (see FundWalletDialog) — a transaction in flight shouldn't
 * be dismissable. */
function FundingProcessingStep({ values, onSettled }: FundingProcessingStepProps) {
	const processFunding = useProcessFunding();
	// Guards against React 18/19 StrictMode's double-invoked effects firing
	// this twice in dev, which would otherwise kick off two fake requests.
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;
		processFunding.mutate(values, {
			onSuccess: () => onSettled("success"),
			onError: () => onSettled("failed"),
		});
		// Intentionally run once on mount — `values`/`onSettled`/`processFunding`
		// are stable for the lifetime of this step.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex flex-col items-center gap-6 py-6 text-center sm:py-10">
			<Loader2
				className="size-12 animate-spin text-primary-500 sm:size-14"
				aria-hidden="true"
			/>
			<div className="flex flex-col gap-2">
				<h2 className="text-s1 text-foreground sm:text-h5">
					Processing your funding
				</h2>
				<p className="text-b4 text-muted-foreground sm:text-b3">
					Adding {formatUsdc(values.amount)} USDC to your wallet — this only
					takes a moment.
				</p>
			</div>
		</div>
	);
}

export { FundingProcessingStep };
