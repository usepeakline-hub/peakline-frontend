"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useProcessTransfer } from "@/features/send/hooks";
import type { SendMoneyValues } from "@/lib/validations/sendValidations";
import { formatUsdc } from "@/lib/currency";

interface TransferProcessingStepProps {
	values: SendMoneyValues;
	onSettled: (result: "success" | "failed") => void;
}

/** Step 3 — fires the actual (fake) transfer on mount and reports back once
 * it settles. `min-h-full` + `justify-center` centers the loader within
 * whatever height the page's own container actually resolves to (dashboard
 * `main` stretches via `flex-1` to fill the viewport) rather than guessing
 * at a `vh` fraction — an earlier attempt at this on the equivalent Fund
 * Wallet step used a fixed `vh` value, which under- or overshot depending
 * on how tall the surrounding chrome actually was. */
function TransferProcessingStep({ values, onSettled }: TransferProcessingStepProps) {
	const processTransfer = useProcessTransfer();
	// Guards against React 18/19 StrictMode's double-invoked effects firing
	// this twice in dev, which would otherwise kick off two fake requests.
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;
		processTransfer.mutate(values, {
			onSuccess: () => onSettled("success"),
			onError: () => onSettled("failed"),
		});
		// Intentionally run once on mount — `values`/`onSettled`/`processTransfer`
		// are stable for the lifetime of this step.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex min-h-full flex-col items-center justify-center gap-6 text-center">
			<Loader2
				className="size-12 animate-spin text-primary-500 sm:size-14"
				aria-hidden="true"
			/>
			<div className="flex flex-col gap-2">
				<h2 className="text-s1 text-foreground sm:text-h5">Processing your transfer</h2>
				<p className="text-b4 text-muted-foreground sm:text-b3">
					Sending {formatUsdc(values.amount)} USDC — this only takes a moment.
				</p>
			</div>
		</div>
	);
}

export { TransferProcessingStep };
