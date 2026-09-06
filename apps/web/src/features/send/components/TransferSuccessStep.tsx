"use client";

import { Check } from "lucide-react";
import { Button } from "@repo/ui/button";
import { UserAvatar } from "@/features/dashboard/components/UserAvatar";
import { useWalletBalance } from "@/features/dashboard/hooks";
import { FAKE_RECIPIENT_NAME } from "@/lib/send";
import { formatUsdc, usdcToGhs } from "@/lib/currency";
import type { SendMoneyValues } from "@/lib/validations/sendValidations";

interface TransferSuccessStepProps {
	values: SendMoneyValues;
	onGoToDashboard: () => void;
	onViewTransactions: () => void;
}

/** Step 4a, per the mobile mock: checkmark, amount, a "To" recipient row,
 * then the new balance. New Balance is computed (current - sent), not
 * copied from the mock, for the same reason `FundingSuccessStep` computes
 * rather than hardcodes it — a real wallet's balance before the transfer
 * could be anything. */
function TransferSuccessStep({
	values,
	onGoToDashboard,
	onViewTransactions,
}: TransferSuccessStepProps) {
	const { data: balance } = useWalletBalance();
	const newBalance = Math.max((balance?.amount ?? 0) - values.amount, 0);

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
				<h2 className="text-s1 text-foreground sm:text-h5">Transfer Successful!</h2>
				<p className="text-b4 text-muted-foreground sm:text-b3">
					You have successfully sent
				</p>
				<p className="text-h5 text-foreground sm:text-h4">
					{formatUsdc(values.amount)} USDC
				</p>
				<p className="text-b4 text-muted-foreground sm:text-b3">
					~ GHS {formatUsdc(usdcToGhs(values.amount))}
				</p>
			</div>

			<div className="flex w-full flex-col items-start gap-2 text-left">
				<span className="text-c1 text-muted-foreground sm:text-b3">To</span>
				<div className="flex items-center gap-3">
					<UserAvatar
						name={FAKE_RECIPIENT_NAME}
						className="bg-primary-600 text-primary-foreground"
					/>
					<div className="flex flex-col">
						<span className="text-b3 font-semibold text-foreground sm:text-b2">
							{FAKE_RECIPIENT_NAME}
						</span>
						<span className="text-c1 text-muted-foreground sm:text-b3">
							{values.recipient}
						</span>
					</div>
				</div>
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

export { TransferSuccessStep };
