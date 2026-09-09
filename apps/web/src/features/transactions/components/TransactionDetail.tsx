"use client";

import { Check, Clock, RefreshCw, X, Ban, Copy } from "lucide-react";
import { toast } from "@repo/ui/sonner";
import { UserAvatar } from "@/features/dashboard/components/UserAvatar";
import { STATUS_LABEL, PAYMENT_METHOD_LABEL } from "@/lib/transactions";
import { formatUsdc, usdcToGhs } from "@/lib/currency";
import type { Transaction } from "@/features/dashboard/hooks";

const STATUS_BANNER: Record<
	Transaction["status"],
	{ icon: typeof Check; className: string; headingSuffix: string }
> = {
	completed: { icon: Check, className: "bg-success text-success-foreground", headingSuffix: "Successful!" },
	pending: { icon: Clock, className: "bg-warning text-warning-foreground", headingSuffix: "Pending" },
	processing: { icon: RefreshCw, className: "bg-info text-info-foreground", headingSuffix: "Processing" },
	failed: { icon: X, className: "bg-destructive text-destructive-foreground", headingSuffix: "Failed" },
	cancelled: { icon: Ban, className: "bg-neutral-700 text-white", headingSuffix: "Cancelled" },
};

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-4 py-3 text-c1 sm:text-b3">
			<span className="text-muted-foreground">{label}</span>
			<span className="font-semibold text-foreground">{value}</span>
		</div>
	);
}

interface TransactionDetailProps {
	transaction: Transaction;
	/** "Transfer" for this feature's own usage; "Payment" for the merchant
	 * Payments detail page, which reuses this whole layout rather than
	 * duplicating it — same receipt shape either way. */
	noun?: string;
	/** "To" for a transfer (money leaving, to someone); "From" for a
	 * merchant payment (money coming in, from a customer). */
	counterpartyLabel?: string;
}

/**
 * The receipt-style page a `TransactionRow` (or a merchant `PaymentsTable`
 * row) links to. Status-aware rather than a fixed "Transfer Successful!" —
 * the mock's own two examples were both completed transfers, but this page
 * also has to render pending/processing/failed/cancelled entries sensibly,
 * so banner color, icon, and heading all follow the fixed status→token
 * mapping from CLAUDE.md (Pending→warning, Processing→info, Completed→
 * success, Failed→destructive, Cancelled→neutral).
 */
function TransactionDetail({
	transaction,
	noun = "Transfer",
	counterpartyLabel = "To",
}: TransactionDetailProps) {
	const { icon: Icon, className, headingSuffix } = STATUS_BANNER[transaction.status];
	const amount = Math.abs(transaction.amount);

	async function handleCopyTxId() {
		try {
			await navigator.clipboard.writeText(transaction.txId);
			toast.success("Transaction ID copied");
		} catch {
			toast.error("Couldn't copy");
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div className={`flex items-center gap-3 rounded-2xl p-5 sm:p-6 ${className}`}>
				<Icon className="size-6 shrink-0" aria-hidden="true" />
				<span className="text-s1 sm:text-h5">{STATUS_LABEL[transaction.status]}</span>
			</div>

			<div className="flex flex-col items-center gap-1 text-center">
				<h2 className="text-s1 text-foreground sm:text-h5">
					{noun} {headingSuffix}
				</h2>
			</div>

			<div className="flex flex-col gap-1 rounded-xl border border-secondary-300 bg-secondary-100 p-4 sm:p-5">
				<span className="text-h5 text-foreground sm:text-h4">
					{formatUsdc(amount)} {transaction.currency}
				</span>
				<span className="text-c1 text-muted-foreground sm:text-b3">
					~ GHS {formatUsdc(usdcToGhs(amount))}
				</span>
			</div>

			{transaction.counterpartyName && (
				<div className="flex flex-col gap-2">
					<span className="text-c1 text-muted-foreground sm:text-b3">
						{counterpartyLabel}
					</span>
					<div className="flex items-center gap-3">
						<UserAvatar
							name={transaction.counterpartyName}
							className="bg-primary-600 text-primary-foreground"
						/>
						<div className="flex flex-col">
							<span className="text-b3 font-semibold text-foreground sm:text-b2">
								{transaction.counterpartyName}
							</span>
							{transaction.counterpartyPhone && (
								<span className="text-c1 text-muted-foreground sm:text-b3">
									{transaction.counterpartyPhone}
								</span>
							)}
						</div>
					</div>
				</div>
			)}

			<div className="flex flex-col divide-y divide-border">
				<DetailRow label="Date" value={transaction.date} />
				<DetailRow label="Network" value="Stellar" />
				<DetailRow label="Est. Fee" value="0.00 USDC" />
				{transaction.paymentMethod && (
					<DetailRow
						label="Payment Method"
						value={PAYMENT_METHOD_LABEL[transaction.paymentMethod]}
					/>
				)}
				<div className="flex items-center justify-between gap-4 py-3 text-c1 sm:text-b3">
					<span className="text-muted-foreground">Transaction ID</span>
					<button
						type="button"
						onClick={handleCopyTxId}
						className="flex items-center gap-1.5 font-semibold text-foreground hover:text-primary-600"
					>
						<span className="max-w-48 truncate sm:max-w-none">{transaction.txId}</span>
						<Copy className="size-4 shrink-0" aria-hidden="true" />
					</button>
				</div>
			</div>
		</div>
	);
}

export { TransactionDetail };
