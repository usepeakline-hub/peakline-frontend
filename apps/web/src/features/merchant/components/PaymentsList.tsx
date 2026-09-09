"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@repo/ui/skeleton";
import { toast } from "@repo/ui/sonner";
import { Pagination } from "@/components/Pagination";
import { useMerchantPayments } from "@/features/merchant/hooks";
import { PaymentsFilters } from "@/features/merchant/components/PaymentsFilters";
import { PaymentsTable } from "@/features/merchant/components/PaymentsTable";
import { PAYMENT_METHOD_LABEL, STATUS_LABEL } from "@/lib/transactions";
import type { Transaction } from "@/features/dashboard/hooks";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function PaymentsListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<Skeleton className="h-11 w-full" />
			<Skeleton className="h-72 w-full rounded-xl" />
		</div>
	);
}

/** Matches on customer name, same convention as `TransactionHistoryList`. */
function matchesSearch(payment: Transaction, search: string) {
	if (!search.trim()) return true;
	return (payment.counterpartyName ?? "").toLowerCase().includes(search.trim().toLowerCase());
}

function matchesDateRange(payment: Transaction, from: string, to: string) {
	if (!payment.isoDate) return true;
	if (from && payment.isoDate < from) return false;
	if (to && payment.isoDate > to) return false;
	return true;
}

/** Builds a real CSV from whatever's currently filtered and hands it to the
 * browser as a download — the one piece here that isn't just filtering
 * already-fetched fake data, so it's worth actually doing rather than
 * wiring a button that looks clickable and does nothing. */
function downloadCsv(payments: Transaction[]) {
	const header = ["Date", "Customer", "Payment Method", "Amount (USDC)", "Status"];
	const rows = payments.map((payment) => [
		payment.date,
		payment.counterpartyName ?? "",
		payment.paymentMethod ? PAYMENT_METHOD_LABEL[payment.paymentMethod] : "",
		payment.amount.toFixed(2),
		STATUS_LABEL[payment.status],
	]);
	const csv = [header, ...rows]
		.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
		.join("\n");

	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
	link.click();
	URL.revokeObjectURL(url);
}

/** The Payments page's own list — owns filter state, same shape as
 * `TransactionHistoryList` (search + status), extended with a real date
 * range, CSV export, and (per the updated mock) real pagination over
 * whatever the filters leave — same `Pagination` control
 * `RecentPaymentsSection` uses, so both lists behave identically. */
function PaymentsList() {
	const { data } = useMerchantPayments();
	const [search, setSearch] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [status, setStatus] = useState<Transaction["status"] | "all">("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const filtered = useMemo(() => {
		if (!data) return null;
		return data.filter(
			(payment) =>
				matchesSearch(payment, search) &&
				matchesDateRange(payment, from, to) &&
				(status === "all" || payment.status === status),
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
			toast.error("No payments to export");
			return;
		}
		downloadCsv(filtered);
		toast.success("Payments exported");
	}

	return (
		<div className="flex flex-col gap-4">
			<PaymentsFilters
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
				<PaymentsListSkeleton />
			) : (
				<>
					<PaymentsTable payments={pageItems} />
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

export { PaymentsList };
