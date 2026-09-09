"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "@repo/ui/badge";
import { Select } from "@repo/ui/select";
import { Skeleton } from "@repo/ui/skeleton";
import { cn } from "@repo/ui/lib/utils";
import { useRecentPayments } from "@/features/merchant/hooks";
import { PAYMENT_METHOD_LABEL, formatTransactionAmount } from "@/lib/transactions";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function RecentPaymentsSkeleton() {
	return (
		<div className="flex flex-col gap-3">
			{Array.from({ length: 4 }, (_, i) => (
				<Skeleton key={i} className="h-16 w-full rounded-xl" />
			))}
		</div>
	);
}

function CardRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<span className="text-c1 text-muted-foreground">{label}</span>
			<span className="text-b3 font-medium text-foreground">{value}</span>
		</div>
	);
}

/**
 * Overview's "Recent Payments" — a real table on desktop (Customer, Amount,
 * Method, Status, Date — a different column order than `PaymentsTable`'s
 * own, matching this section's own mock exactly), stacked cards on mobile
 * (per the mock's own dedicated mobile layout, rather than `PaymentsTable`'s
 * horizontal-scroll fallback — a nicer treatment worth using here since a
 * mock actually specifies it). Real pagination (page + page size both
 * change what's fetched) over the fake 50-row dataset.
 */
function RecentPaymentsSection() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const { data } = useRecentPayments(page, pageSize);
	const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

	function handlePageSizeChange(value: number) {
		setPageSize(value);
		setPage(1);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h2 className="text-s1 text-foreground sm:text-h5">Recent Payments</h2>
				<Link
					href="/payments"
					className="text-c2 font-medium text-primary hover:underline sm:text-b3"
				>
					View all
				</Link>
			</div>

			{!data ? (
				<RecentPaymentsSkeleton />
			) : (
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
								</tr>
							</thead>
							<tbody>
								{data.items.map((payment) => (
									<tr key={payment.id} className="border-t border-border">
										<td className="p-4 text-b3 text-foreground">
											{payment.counterpartyName}
										</td>
										<td className="p-4 text-b3 font-semibold text-success">
											{formatTransactionAmount(payment)}
										</td>
										<td className="p-4 text-b3 text-foreground">
											{payment.paymentMethod
												? PAYMENT_METHOD_LABEL[payment.paymentMethod]
												: "—"}
										</td>
										<td className="p-4">
											<StatusBadge status={payment.status} />
										</td>
										<td className="p-4 text-b3 text-foreground">{payment.date}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="flex flex-col gap-3 lg:hidden">
						{data.items.map((payment) => (
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
										payment.paymentMethod
											? PAYMENT_METHOD_LABEL[payment.paymentMethod]
											: "—"
									}
								/>
								<CardRow label="Status" value={<StatusBadge status={payment.status} />} />
								<CardRow label="Date" value={payment.date} />
							</div>
						))}
					</div>

					<div className="flex flex-col items-center justify-between gap-3 text-c1 text-muted-foreground sm:flex-row sm:text-b3">
						<div className="flex items-center gap-2">
							<span className="hidden sm:inline">Showing</span>
							<Select
								value={String(pageSize)}
								onChange={(e) => handlePageSizeChange(Number(e.target.value))}
								aria-label="Rows per page"
								className="hidden h-9 w-20 pr-8 sm:flex"
							>
								{PAGE_SIZE_OPTIONS.map((size) => (
									<option key={size} value={size}>
										{size}
									</option>
								))}
							</Select>
							<span className="sm:hidden">Showing {data.items.length}</span>
							<span>of {data.total} entries</span>
						</div>

						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
								aria-label="Previous page"
								className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground disabled:cursor-not-allowed disabled:opacity-40"
							>
								<ChevronLeft className="size-4" aria-hidden="true" />
							</button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
								<button
									key={p}
									type="button"
									onClick={() => setPage(p)}
									aria-current={p === page ? "page" : undefined}
									className={cn(
										"flex size-8 items-center justify-center rounded-lg text-b3 font-medium",
										p === page
											? "bg-primary-500 text-primary-foreground"
											: "text-foreground hover:bg-muted",
									)}
								>
									{p}
								</button>
							))}
							<button
								type="button"
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}
								aria-label="Next page"
								className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground disabled:cursor-not-allowed disabled:opacity-40"
							>
								<ChevronRight className="size-4" aria-hidden="true" />
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export { RecentPaymentsSection };
