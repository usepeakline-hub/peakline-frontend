"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, ScanLine } from "lucide-react";
import { Skeleton } from "@repo/ui/skeleton";
import { cn } from "@repo/ui/lib/utils";
import {
	useRecentTransactions,
	type Transaction,
	type TransactionKind,
} from "@/features/dashboard/hooks";

const KIND_STYLES: Record<
	TransactionKind,
	{ icon: typeof ArrowDownLeft; className: string }
> = {
	received: { icon: ArrowDownLeft, className: "bg-primary-600" },
	sent: { icon: ArrowUpRight, className: "bg-destructive" },
	scan_pay: { icon: ScanLine, className: "bg-primary-800" },
};

// Plain muted text per the mock, not the colored StatusBadge pill —
// confirmed by both the desktop and mobile screenshots.
const STATUS_LABEL: Record<Transaction["status"], string> = {
	pending: "Pending",
	processing: "Processing",
	completed: "Completed",
	failed: "Failed",
	cancelled: "Cancelled",
};

function formatAmount(transaction: Transaction) {
	const sign = transaction.amount > 0 ? "+" : "−";
	const value = Math.abs(transaction.amount).toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	return `${sign}${value} ${transaction.currency}`;
}

function RecentTransactionsSkeleton() {
	return (
		<div className="flex flex-col">
			{Array.from({ length: 4 }, (_, i) => (
				<div
					key={i}
					className="flex items-center gap-4 border-b border-border py-4 last:border-0"
				>
					<Skeleton className="size-11 shrink-0 rounded-full" />
					<div className="flex flex-1 flex-col gap-2">
						<Skeleton className="h-4 w-40 max-w-full" />
						<Skeleton className="h-3 w-24" />
					</div>
					<div className="flex flex-col items-end gap-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-3 w-16" />
					</div>
				</div>
			))}
		</div>
	);
}

function RecentTransactions() {
	const { data } = useRecentTransactions();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h2 className="text-s1 text-foreground sm:text-h5">Recent Transactions</h2>
				<Link
					href="/transactions"
					className="text-c2 font-medium text-primary hover:underline sm:text-b3"
				>
					View all
				</Link>
			</div>

			{!data ? (
				<RecentTransactionsSkeleton />
			) : (
				<div className="flex flex-col">
					{data.map((transaction) => {
						const { icon: Icon, className } = KIND_STYLES[transaction.kind];
						return (
							<div
								key={transaction.id}
								className="flex items-center gap-4 border-b border-border py-4 last:border-0"
							>
								<span
									className={cn(
										"flex size-9 shrink-0 items-center justify-center rounded-full text-primary-foreground sm:size-11",
										className,
									)}
								>
									<Icon className="size-4 sm:size-5" aria-hidden="true" />
								</span>
								<div className="flex flex-1 flex-col gap-0.5">
									<span className="text-b4 text-foreground sm:text-b2">
										{transaction.title}
									</span>
									<span className="text-c1 text-muted-foreground">
										{transaction.timestamp}
									</span>
								</div>
								<div className="flex flex-col items-end gap-1">
									<span
										className={cn(
											"text-b4 font-semibold sm:text-b2",
											transaction.amount > 0
												? "text-success"
												: "text-destructive",
										)}
									>
										{formatAmount(transaction)}
									</span>
									<span className="text-c1 text-muted-foreground">
										{STATUS_LABEL[transaction.status]}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export { RecentTransactions };
