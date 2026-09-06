"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { MerchantAvatar } from "@/features/pay/components/MerchantAvatar";
import { useWalletBalance } from "@/features/dashboard/hooks";
import { formatUsdc, usdcToGhs } from "@/lib/currency";
import type { FakeMerchant } from "@/lib/pay";

interface MerchantPaymentCardProps {
	merchant: FakeMerchant | null;
	onContinue: (amount: number) => void;
}

/** Right-hand card, per the mock — "No Merchant Scanned" until a merchant
 * comes back from `ScanMerchantCard`, then the merchant + an amount to pay
 * them. `min-h-full` keeps its height matching the scan card's next to it
 * on desktop, empty state or not. */
function MerchantPaymentCard({ merchant, onContinue }: MerchantPaymentCardProps) {
	const { data: balance } = useWalletBalance();
	const [amount, setAmount] = useState("");
	const [error, setError] = useState<string | null>(null);
	const amountNumber = Number(amount);
	const amountValid = amountNumber > 0;

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!amountValid) {
			setError("Enter an amount greater than 0");
			return;
		}
		if (balance && amountNumber > balance.amount) {
			setError("Insufficient balance");
			return;
		}
		onContinue(amountNumber);
	}

	return (
		<div className="flex min-h-full flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-300 bg-secondary-100 p-6 text-center sm:p-8">
			{!merchant ? (
				<p className="text-b3 text-muted-foreground sm:text-b2">No Merchant Scanned</p>
			) : (
				<form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-4">
					<MerchantAvatar name={merchant.name} />
					<div className="flex flex-col gap-0.5">
						<span className="text-b2 font-semibold text-foreground sm:text-b1">
							{merchant.name}
						</span>
						<span className="text-c1 text-muted-foreground sm:text-b3">Merchant</span>
					</div>

					<div className="flex w-full flex-col gap-2 text-left">
						<label className="text-label text-foreground">Amount</label>
						<div className="flex gap-3">
							<Input
								type="number"
								inputMode="decimal"
								min={0}
								step="any"
								placeholder="0"
								value={amount}
								onChange={(e) => {
									setAmount(e.target.value);
									setError(null);
								}}
							/>
							<div className="flex h-11 w-24 shrink-0 items-center justify-center rounded-lg border border-input bg-background text-b1 text-foreground">
								USDC
							</div>
						</div>
						{amountValid && (
							<p className="text-c1 text-muted-foreground">
								~ GHS {formatUsdc(usdcToGhs(amountNumber))}
							</p>
						)}
						{error && <p className="text-c1 text-destructive">{error}</p>}
					</div>

					{balance && (
						<div className="flex w-full items-center justify-between text-c1 sm:text-b3">
							<span className="text-muted-foreground">Available Balance</span>
							<span className="font-semibold text-foreground">
								{formatUsdc(balance.amount)} {balance.currency}
							</span>
						</div>
					)}

					<Button type="submit" size="large" className="w-full">
						Pay
					</Button>
				</form>
			)}
		</div>
	);
}

export { MerchantPaymentCard };
