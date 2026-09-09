"use client";

import Link from "next/link";
import { StatusBadge } from "@repo/ui/badge";
import { PAYMENT_METHOD_LABEL, formatTransactionAmount } from "@/lib/transactions";
import type { Transaction } from "@/features/dashboard/hooks";

/**
 * A real `<table>`, per the mock — unlike `TransactionRow`'s card-style
 * list, this reads as a ledger/export-style view, which a literal table
 * communicates better than another stack of rows. No mobile mock exists for
 * this one; `overflow-x-auto` lets it scroll horizontally there rather than
 * trying to invent an unreviewed card layout for five columns.
 */
function PaymentsTable({ payments }: { payments: Transaction[] }) {
	if (payments.length === 0) {
		return (
			<p className="py-8 text-center text-b3 text-muted-foreground">
				No payments match your filters.
			</p>
		);
	}

	return (
		<div className="overflow-x-auto rounded-xl border border-border">
			<table className="w-full min-w-175 border-collapse text-left">
				<thead>
					<tr className="bg-muted">
						<th className="p-4 text-label text-muted-foreground">Date</th>
						<th className="p-4 text-label text-muted-foreground">Customer</th>
						<th className="p-4 text-label text-muted-foreground">Payment Method</th>
						<th className="p-4 text-label text-muted-foreground">Amount (USDC)</th>
						<th className="p-4 text-label text-muted-foreground">Status</th>
					</tr>
				</thead>
				<tbody>
					{payments.map((payment) => (
						<tr key={payment.id} className="border-t border-border hover:bg-muted/50">
							<td className="p-0">
								<Link
									href={`/payments/${payment.id}`}
									className="block p-4 text-b3 text-foreground"
								>
									{payment.date}
								</Link>
							</td>
							<td className="p-0">
								<Link
									href={`/payments/${payment.id}`}
									className="block p-4 text-b3 text-foreground"
								>
									{payment.counterpartyName}
								</Link>
							</td>
							<td className="p-0">
								<Link
									href={`/payments/${payment.id}`}
									className="block p-4 text-b3 text-foreground"
								>
									{payment.paymentMethod
										? PAYMENT_METHOD_LABEL[payment.paymentMethod]
										: "—"}
								</Link>
							</td>
							<td className="p-0">
								<Link
									href={`/payments/${payment.id}`}
									className="block p-4 text-b3 font-semibold text-success"
								>
									{formatTransactionAmount(payment)}
								</Link>
							</td>
							<td className="p-0">
								<Link href={`/payments/${payment.id}`} className="block p-4">
									<StatusBadge status={payment.status} />
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export { PaymentsTable };
