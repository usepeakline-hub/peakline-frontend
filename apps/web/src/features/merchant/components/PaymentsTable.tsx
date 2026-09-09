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

/**
 * A real `<table>` on desktop — Customer, Amount, Method, Status, Date,
 * then a dedicated Action column with an eye icon linking to the payment's
 * own detail page, per the updated mock (replacing the earlier
 * whole-row-as-link treatment). Stacked cards on mobile, same field set,
 * with the eye icon pinned to each card's own bottom-right corner —
 * matching `RecentPaymentsSection`'s card convention so the two "same
 * shape of data, different page" lists don't drift stylistically apart.
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
						{payments.map((payment) => (
							<tr key={payment.id} className="border-t border-border hover:bg-muted/50">
								<td className="p-4 text-b3 text-foreground">{payment.counterpartyName}</td>
								<td className="p-4 text-b3 font-semibold text-success">
									{formatTransactionAmount(payment)}
								</td>
								<td className="p-4 text-b3 text-foreground">
									{payment.paymentMethod ? PAYMENT_METHOD_LABEL[payment.paymentMethod] : "—"}
								</td>
								<td className="p-4">
									<StatusBadge status={payment.status} />
								</td>
								<td className="p-4 text-b3 text-foreground">{payment.date}</td>
								<td className="p-4">
									<Link
										href={`/payments/${payment.id}`}
										aria-label={`View payment from ${payment.counterpartyName ?? "customer"}`}
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
				{payments.map((payment) => (
					<div
						key={payment.id}
						className="flex flex-col gap-3 rounded-xl border border-border p-4"
					>
						<CardRow label="Customer" value={payment.counterpartyName} />
						<CardRow
							label="Amount (USDC)"
							value={
								<span className="font-semibold text-success">
									{formatTransactionAmount(payment)}
								</span>
							}
						/>
						<CardRow
							label="Method"
							value={
								payment.paymentMethod ? PAYMENT_METHOD_LABEL[payment.paymentMethod] : "—"
							}
						/>
						<CardRow label="Status" value={<StatusBadge status={payment.status} />} />
						<CardRow label="Date" value={payment.date} />
						<div className="flex justify-end">
							<Link
								href={`/payments/${payment.id}`}
								aria-label={`View payment from ${payment.counterpartyName ?? "customer"}`}
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

export { PaymentsTable };
