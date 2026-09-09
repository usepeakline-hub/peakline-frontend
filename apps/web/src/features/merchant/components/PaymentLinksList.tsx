"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@repo/ui/skeleton";
import { toast } from "@repo/ui/sonner";
import { Pagination } from "@/components/Pagination";
import { useMerchantPaymentLinks } from "@/features/merchant/hooks";
import { PaymentLinksStatsCards } from "@/features/merchant/components/PaymentLinksStatsCards";
import { PaymentLinksFilters } from "@/features/merchant/components/PaymentLinksFilters";
import { PaymentLinksTable } from "@/features/merchant/components/PaymentLinksTable";
import type { PaymentLink, PaymentLinkStatus } from "@/features/merchant/hooks";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function PaymentLinksListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<Skeleton className="h-11 w-full" />
			<Skeleton className="h-72 w-full rounded-xl" />
		</div>
	);
}

function matchesSearch(paymentLink: PaymentLink, search: string) {
	if (!search.trim()) return true;
	return paymentLink.title.toLowerCase().includes(search.trim().toLowerCase());
}

function matchesDateRange(paymentLink: PaymentLink, from: string, to: string) {
	if (from && paymentLink.isoExpiration < from) return false;
	if (to && paymentLink.isoExpiration > to) return false;
	return true;
}

function downloadCsv(links: PaymentLink[]) {
	const header = ["Title", "Amount (USDC)", "Created", "Expires", "Status", "Link"];
	const rows = links.map((link) => [
		link.title,
		link.amount.toFixed(2),
		link.created,
		link.expiration,
		link.status,
		link.link,
	]);
	const csv = [header, ...rows]
		.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
		.join("\n");

	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = `payment-links-${new Date().toISOString().slice(0, 10)}.csv`;
	anchor.click();
	URL.revokeObjectURL(url);
}

/** `/payment-links`'s own list — same owns-its-own-filter-state shape as
 * `PaymentsList`, extended with the mock's header stat cards and real
 * pagination over whatever the filters leave. */
function PaymentLinksList() {
	const { data } = useMerchantPaymentLinks();
	const [search, setSearch] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [status, setStatus] = useState<PaymentLinkStatus | "all">("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const filtered = useMemo(() => {
		if (!data) return null;
		return data.filter(
			(link) =>
				matchesSearch(link, search) &&
				matchesDateRange(link, from, to) &&
				(status === "all" || link.status === status),
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
			toast.error("No payment links to export");
			return;
		}
		downloadCsv(filtered);
		toast.success("Payment links exported");
	}

	return (
		<div className="flex flex-col gap-6">
			<PaymentLinksStatsCards />

			<div className="flex flex-col gap-4">
				<PaymentLinksFilters
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
					<PaymentLinksListSkeleton />
				) : (
					<>
						<PaymentLinksTable links={pageItems} />
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
		</div>
	);
}

export { PaymentLinksList };
