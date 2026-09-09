"use client";

import { Check } from "lucide-react";
import { Button } from "@repo/ui/button";
import { MerchantAvatar } from "@/features/pay/components/MerchantAvatar";
import { useWalletBalance } from "@/features/dashboard/hooks";
import { formatUsdc, usdcToGhs } from "@/lib/currency";
import type { PayFlowValues } from "@/features/pay/store/payFlowStore";

interface PaymentSuccessStepProps {
	values: PayFlowValues;
	onGoToDashboard: () => void;
	onViewTransactions: () => void;
}

/** Matches the mock: checkmark, amount, merchant, new balance. New Balance
 * is computed (current - paid), not copied from the mock's own numbers —
 * same reasoning as `TransferSuccessStep`/`FundingSuccessStep`, whose two
 * reference screenshots didn't even agree on the new balance with each
 * other, let alone with a real wallet's actual balance before the payment.
 *
 * `min-h-full` + `justify-center` vertically centers this within whatever
 * height the page's own container resolves to, same fix as
 * `PaymentProcessingStep`'s. */
function PaymentSuccessStep({
	values,
	onGoToDashboard,
	onViewTransactions,
}: PaymentSuccessStepProps) {
	const { data: balance } = useWalletBalance();
	const newBalance = Math.max((balance?.amount ?? 0) - values.amount, 0);

	return (
		<div className="flex min-h-full flex-col items-center justify-center gap-6 py-2 text-center sm:py-4">
			<span className="flex size-16 items-center justify-center rounded-full bg-primary-500 sm:size-20">
				<Check
					className="size-7 text-primary-foreground sm:size-9"
					strokeWidth={3}
					aria-hidden="true"
				/>
			</span>

			<div className="flex flex-col gap-1">
				<h2 className="text-s1 text-foreground sm:text-h5">Payment Successful!</h2>
				<p className="text-b4 text-muted-foreground sm:text-b3">
					You have successfully paid
				</p>
				<p className="text-h5 text-foreground sm:text-h4">
					{formatUsdc(values.amount)} USDC
				</p>
				<p className="text-b4 text-muted-foreground sm:text-b3">
					~ GHS {formatUsdc(usdcToGhs(values.amount))}
				</p>
			</div>

			<div className="flex flex-col items-center gap-2">
				<MerchantAvatar name={values.merchant.name} />
				<span className="text-b3 font-semibold text-foreground sm:text-b2">
					{values.merchant.name}
				</span>
				<span className="text-c1 text-muted-foreground sm:text-b3">Merchant</span>
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

export { PaymentSuccessStep };
