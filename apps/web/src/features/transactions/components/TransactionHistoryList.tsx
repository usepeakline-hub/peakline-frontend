"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@repo/ui/skeleton";
import { useTransactionHistory } from "@/features/transactions/hooks";
import { TransactionRow } from "@/features/transactions/components/TransactionRow";
import { TransactionFilters } from "@/features/transactions/components/TransactionFilters";
import type { Transaction } from "@/features/dashboard/hooks";

function TransactionHistoryListSkeleton() {
	return (
		<div className="flex flex-col">
			{Array.from({ length: 6 }, (_, i) => (
				<div
					key={i}
					className="flex items-center gap-4 border-b border-border py-4 last:border-0"
				>
					<Skeleton className="size-9 shrink-0 rounded-full sm:size-11" />
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

/** Matches on the transaction's title (which already reads as a name —
 * "Received from John Doe", "Transfer to Ama Serwaa" — since that's the
 * only name-shaped text every entry has; scan_pay's "Scan & Pay" simply
 * won't match a person's name search, which is correct. */
function matchesSearch(transaction: Transaction, search: string) {
	if (!search.trim()) return true;
	return transaction.title.toLowerCase().includes(search.trim().toLowerCase());
}

/** The `/transactions` page's own full list — the "view all" this page
 * exists to be, versus the dashboard's abbreviated latest-4. Owns the
 * search/status filter state since it's the only thing that needs it. */
function TransactionHistoryList() {
	const { data } = useTransactionHistory();
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<Transaction["status"] | "all">("all");

	const filtered = useMemo(() => {
		if (!data) return null;
		return data.filter(
			(transaction) =>
				matchesSearch(transaction, search) &&
				(status === "all" || transaction.status === status),
		);
	}, [data, search, status]);

	return (
		<div className="flex flex-col gap-4">
			<TransactionFilters
				search={search}
				onSearchChange={setSearch}
				status={status}
				onStatusChange={setStatus}
			/>

			{!filtered ? (
				<TransactionHistoryListSkeleton />
			) : filtered.length === 0 ? (
				<p className="py-8 text-center text-b3 text-muted-foreground">
					No transactions match your search.
				</p>
			) : (
				<div className="flex flex-col">
					{filtered.map((transaction) => (
						<TransactionRow key={transaction.id} transaction={transaction} />
					))}
				</div>
			)}
		</div>
	);
}

export { TransactionHistoryList };
