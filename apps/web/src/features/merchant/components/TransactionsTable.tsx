"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { StatusBadge } from "@repo/ui/badge";
import { PAYMENT_METHOD_LABEL, formatTransactionAmount } from "@/lib/transactions";
import type { Transaction } from "@/features/dashboard/hooks";

function CardRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<span className="text-c1 text-muted-foreground">{label}</span>
			<span className="text-b3 font-medium text-foreground">{value}</span>
		</div>
	);
}

/** Merchant's own `/transactions` list rendering — identical shape to
 * `PaymentsTable` (same mock, same columns), linking to `/transactions/[id]`
 * instead of `/payments/[id]`. Kept as its own component rather than shared
 * for the same reason `PaymentsTable`/`PaymentLinksTable` stayed separate —
 * a shared generic table would need to know which detail route to link to
 * and which query key backs it, which is more indirection than the small
 * amount of duplication it would save. */
function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
	if (transactions.length === 0) {
		return (
			<p className="py-8 text-center text-b3 text-muted-foreground">
				No transactions match your filters.
			</p>
		);
	}

	return (
		<>
			<div className="hidden overflow-x-auto rounded-xl border border-border lg:block">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="bg-muted">
							<th className="p-4 text-label text-muted-foreground">Customer</th>
							<th className="p-4 text-label text-muted-foreground">Amount (USDC)</th>
							<th className="p-4 text-label text-muted-foreground">Method</th>
							<th className="p-4 text-label text-muted-foreground">Status</th>
							<th className="p-4 text-label text-muted-foreground">Date</th>
							<th className="p-4 text-label text-muted-foreground">Action</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((transaction) => (
							<tr key={transaction.id} className="border-t border-border hover:bg-muted/50">
								<td className="p-4 text-b3 text-foreground">{transaction.counterpartyName}</td>
								<td className="p-4 text-b3 font-semibold text-success">
									{formatTransactionAmount(transaction)}
								</td>
								<td className="p-4 text-b3 text-foreground">
									{transaction.paymentMethod
										? PAYMENT_METHOD_LABEL[transaction.paymentMethod]
										: "—"}
								</td>
								<td className="p-4">
									<StatusBadge status={transaction.status} />
								</td>
								<td className="p-4 text-b3 text-foreground">{transaction.date}</td>
								<td className="p-4">
									<Link
										href={`/transactions/${transaction.id}`}
										aria-label={`View transaction with ${transaction.counterpartyName ?? "customer"}`}
										className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									>
										<Eye className="size-4" aria-hidden="true" />
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col gap-3 lg:hidden">
				{transactions.map((transaction) => (
					<div
						key={transaction.id}
						className="flex flex-col gap-3 rounded-xl border border-border p-4"
					>
						<CardRow label="Customer" value={transaction.counterpartyName} />
						<CardRow
							label="Amount (USDC)"
							value={
								<span className="font-semibold text-success">
									{formatTransactionAmount(transaction)}
								</span>
							}
						/>
						<CardRow
							label="Method"
							value={
								transaction.paymentMethod
									? PAYMENT_METHOD_LABEL[transaction.paymentMethod]
									: "—"
							}
						/>
						<CardRow label="Status" value={<StatusBadge status={transaction.status} />} />
						<CardRow label="Date" value={transaction.date} />
						<div className="flex justify-end">
							<Link
								href={`/transactions/${transaction.id}`}
								aria-label={`View transaction with ${transaction.counterpartyName ?? "customer"}`}
								className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<Eye className="size-4" aria-hidden="true" />
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export { TransactionsTable };
