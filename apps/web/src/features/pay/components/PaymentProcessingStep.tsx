"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useProcessPayment } from "@/features/pay/hooks";
import { formatUsdc } from "@/lib/currency";
import type { PayFlowValues } from "@/features/pay/store/payFlowStore";

interface PaymentProcessingStepProps {
	values: PayFlowValues;
	onSettled: (result: "success" | "failed") => void;
}

/** No reference mock for this step — every other transactional flow (Fund
 * Wallet, Send) has one, so Pay gets the same treatment for consistency.
 * `min-h-full` centers it within the page's actual height, the same fix
 * applied to the other two after the first attempt used a guessed `vh`. */
function PaymentProcessingStep({ values, onSettled }: PaymentProcessingStepProps) {
	const processPayment = useProcessPayment();
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;
		processPayment.mutate(values, {
			onSuccess: () => onSettled("success"),
			onError: () => onSettled("failed"),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex min-h-full flex-col items-center justify-center gap-6 text-center">
			<Loader2
				className="size-12 animate-spin text-primary-500 sm:size-14"
				aria-hidden="true"
			/>
			<div className="flex flex-col gap-2">
				<h2 className="text-s1 text-foreground sm:text-h5">Processing your payment</h2>
				<p className="text-b4 text-muted-foreground sm:text-b3">
					Paying {values.merchant.name} {formatUsdc(values.amount)} USDC — this only
					takes a moment.
				</p>
			</div>
		</div>
	);
}

export { PaymentProcessingStep };
