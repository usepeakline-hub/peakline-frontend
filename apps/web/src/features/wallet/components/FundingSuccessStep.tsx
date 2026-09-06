"use client";

import { Check } from "lucide-react";
import { Button } from "@repo/ui/button";
import { useWalletBalance } from "@/features/dashboard/hooks";
import { formatUsdc, usdcToGhs } from "@/lib/currency";
import type { FundWalletValues } from "@/lib/validations/walletValidations";

interface FundingSuccessStepProps {
	values: FundWalletValues;
	onGoToDashboard: () => void;
	onViewTransactions: () => void;
}

/** Step 4a. "New Balance" is computed (current + funded), not copied from
 * the mock — its own screenshot shows the new balance as just the funded
 * amount, which would be wrong for a real wallet that already had money in
 * it, so this always adds to whatever the dashboard's balance query has. */
function FundingSuccessStep({
	values,
	onGoToDashboard,
	onViewTransactions,
}: FundingSuccessStepProps) {
	const { data: balance } = useWalletBalance();
	const newBalance = (balance?.amount ?? 0) + values.amount;

	return (
		<div className="flex flex-col items-center gap-6 py-2 text-center sm:py-4">
			<span className="flex size-16 items-center justify-center rounded-full bg-primary-500 sm:size-20">
				<Check
					className="size-7 text-primary-foreground sm:size-9"
					strokeWidth={3}
					aria-hidden="true"
				/>
			</span>

			<div className="flex flex-col gap-1">
				<h2 className="text-s1 text-foreground sm:text-h5">Funding Successful!</h2>
				<p className="text-b4 text-muted-foreground sm:text-b3">
					You have successfully added
				</p>
				<p className="text-h5 text-foreground sm:text-h4">
					{formatUsdc(values.amount)} USDC
				</p>
				<p className="text-b4 text-muted-foreground sm:text-b3">
					~ GHS {formatUsdc(usdcToGhs(values.amount))} to your wallet
				</p>
			</div>

			<div className="flex w-full flex-col gap-1 rounded-xl border border-secondary-300 bg-secondary-100 p-4 sm:p-5">
				<span className="text-c1 text-muted-foreground sm:text-b3">New Balance</span>
				<span className="text-h5 text-foreground sm:text-h4">
					{formatUsdc(newBalance)} USDC
				</span>
				<span className="text-c1 text-muted-foreground sm:text-b3">
					~ GHS {formatUsdc(usdcToGhs(newBalance))}
				</span>
			</div>

			<div className="flex w-full flex-col items-center gap-4">
				<Button type="button" size="large" className="w-full" onClick={onGoToDashboard}>
					Go to Dashboard
				</Button>
				<button
					type="button"
					onClick={onViewTransactions}
					className="text-b4 font-medium text-foreground hover:underline sm:text-b3"
				>
					View Transactions
				</button>
			</div>
		</div>
	);
}

export { FundingSuccessStep };
