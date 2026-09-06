"use client";

import { X, RefreshCw } from "lucide-react";
import { Button } from "@repo/ui/button";
import { formatUsdc } from "@/lib/currency";
import type { FundWalletValues } from "@/lib/validations/walletValidations";

interface FundingFailedStepProps {
	values: FundWalletValues;
	onTryAgain: () => void;
	onGoToDashboard: () => void;
}

/** Step 4b — no reference mock for this one; built to mirror the success
 * step's layout (same icon-badge + message + card + actions shape) with
 * the destructive palette instead. */
function FundingFailedStep({ values, onTryAgain, onGoToDashboard }: FundingFailedStepProps) {
	return (
		<div className="flex flex-col items-center gap-6 py-2 text-center sm:py-4">
			<span className="flex size-16 items-center justify-center rounded-full bg-destructive sm:size-20">
				<X
					className="size-7 text-destructive-foreground sm:size-9"
					strokeWidth={3}
					aria-hidden="true"
				/>
			</span>

			<div className="flex flex-col gap-2">
				<h2 className="text-s1 text-foreground sm:text-h5">Funding Failed</h2>
				<p className="text-b4 text-muted-foreground sm:text-b3">
					We couldn&apos;t add {formatUsdc(values.amount)} USDC to your wallet.
					Your funding source hasn&apos;t been charged — please try again or
					use a different funding method.
				</p>
			</div>

			<div className="flex w-full flex-col items-center gap-4">
				<Button
					type="button"
					size="large"
					className="w-full"
					onClick={onTryAgain}
				>
					<RefreshCw className="size-4" aria-hidden="true" />
					Try Again
				</Button>
				<button
					type="button"
					onClick={onGoToDashboard}
					className="text-b4 font-medium text-foreground hover:underline sm:text-b3"
				>
					Go to Dashboard
				</button>
			</div>
		</div>
	);
}

export { FundingFailedStep };
