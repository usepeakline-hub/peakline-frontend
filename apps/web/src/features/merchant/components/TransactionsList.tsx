"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@repo/ui/skeleton";
import { toast } from "@repo/ui/sonner";
import { Pagination } from "@/components/Pagination";
import { useMerchantTransactions } from "@/features/merchant/hooks";
import { TransactionsFilters } from "@/features/merchant/components/TransactionsFilters";
import { TransactionsTable } from "@/features/merchant/components/TransactionsTable";
import { PAYMENT_METHOD_LABEL, STATUS_LABEL } from "@/lib/transactions";
import type { Transaction } from "@/features/dashboard/hooks";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function TransactionsListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<Skeleton className="h-11 w-full" />
			<Skeleton className="h-72 w-full rounded-xl" />
		</div>
	);
}

function matchesSearch(transaction: Transaction, search: string) {
	if (!search.trim()) return true;
	return (transaction.counterpartyName ?? "").toLowerCase().includes(search.trim().toLowerCase());
}

function matchesDateRange(transaction: Transaction, from: string, to: string) {
	if (!transaction.isoDate) return true;
	if (from && transaction.isoDate < from) return false;
	if (to && transaction.isoDate > to) return false;
	return true;
}

function downloadCsv(transactions: Transaction[]) {
	const header = ["Date", "Customer", "Payment Method", "Amount (USDC)", "Status"];
	const rows = transactions.map((transaction) => [
		transaction.date,
		transaction.counterpartyName ?? "",
		transaction.paymentMethod ? PAYMENT_METHOD_LABEL[transaction.paymentMethod] : "",
		transaction.amount.toFixed(2),
		STATUS_LABEL[transaction.status],
	]);
	const csv = [header, ...rows]
		.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
		.join("\n");

	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
	link.click();
	URL.revokeObjectURL(url);
}

/** Merchant's own `/transactions` list — same shape as `PaymentsList`
 * (search + date range + status filter, CSV export, real pagination over
 * the filtered results), backed by `useMerchantTransactions` instead of
 * `useMerchantPayments`. Individual keeps its own existing
 * `TransactionHistoryList` untouched — this only renders for a merchant
 * session (see `transactions/page.tsx`'s own branch). */
function TransactionsList() {
	const { data } = useMerchantTransactions();
	const [search, setSearch] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [status, setStatus] = useState<Transaction["status"] | "all">("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const filtered = useMemo(() => {
		if (!data) return null;
		return data.filter(
			(transaction) =>
				matchesSearch(transaction, search) &&
				matchesDateRange(transaction, from, to) &&
				(status === "all" || transaction.status === status),
		);
	}, [data, search, from, to, status]);

	const totalPages = filtered ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;
	const pageItems = filtered ? filtered.slice((page - 1) * pageSize, page * pageSize) : null;

	function handleFilterChange<T>(setter: (value: T) => void) {
		return (value: T) => {
			setter(value);
			setPage(1);
		};
	}

	function handlePageSizeChange(value: number) {
		setPageSize(value);
		setPage(1);
	}

	function handleExport() {
		if (!filtered || filtered.length === 0) {
			toast.error("No transactions to export");
			return;
		}
		downloadCsv(filtered);
		toast.success("Transactions exported");
	}

	return (
		<div className="flex flex-col gap-4">
			<TransactionsFilters
				search={search}
				onSearchChange={handleFilterChange(setSearch)}
				from={from}
				onFromChange={handleFilterChange(setFrom)}
				to={to}
				onToChange={handleFilterChange(setTo)}
				status={status}
				onStatusChange={handleFilterChange(setStatus)}
				onExport={handleExport}
			/>

			{!filtered || !pageItems ? (
				<TransactionsListSkeleton />
			) : (
				<>
					<TransactionsTable transactions={pageItems} />
					{filtered.length > 0 && (
						<Pagination
							page={page}
							totalPages={totalPages}
							pageSize={pageSize}
							onPageChange={setPage}
							onPageSizeChange={handlePageSizeChange}
							pageSizeOptions={PAGE_SIZE_OPTIONS}
							itemsShown={pageItems.length}
							total={filtered.length}
						/>
					)}
				</>
			)}
		</div>
	);
}

export { TransactionsList };
