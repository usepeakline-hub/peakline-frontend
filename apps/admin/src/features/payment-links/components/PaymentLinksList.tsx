"use client";

import { useState } from "react";
import { Link2, ShieldAlert } from "lucide-react";
import { Skeleton } from "@repo/ui/skeleton";
import { Badge } from "@repo/ui/badge";
import { cn } from "@repo/ui/lib/utils";
import { Pagination } from "@/components/data/Pagination";
import { DataTable, type Column } from "@/components/data/DataTable";
import { PaymentLinksFilters } from "@/features/payment-links/components/PaymentLinksFilters";
import { useAdminPaymentLinks } from "@/features/payment-links/hooks";
import { formatDateTime } from "@/lib/format";
import { formatUsdc } from "@/lib/currency";
import type { AdminPaymentLinkData, AdminPaymentLinksQuery } from "@/lib/api/types";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function ListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<Skeleton className="h-11 w-full" />
			<Skeleton className="h-72 w-full rounded-xl" />
		</div>
	);
}

// Same dot+pill convention as apps/web's own `PaymentLinksTable` — ported
// rather than shared (no cross-app import between admin and web), but kept
// visually identical so a link looks the same status regardless of which
// app someone's viewing it from.
const STATUS_BADGE: Record<
	AdminPaymentLinkData["status"],
	{ variant: "completed" | "failed" | "cancelled"; dot: string; label: string }
> = {
	active: { variant: "completed", dot: "bg-success-600", label: "Active" },
	expired: { variant: "failed", dot: "bg-danger-600", label: "Expired" },
	cancelled: { variant: "cancelled", dot: "bg-neutral-400", label: "Cancelled" },
};

function StatusPill({ status }: { status: AdminPaymentLinkData["status"] }) {
	const badge = STATUS_BADGE[status];
	return (
		<Badge variant={badge.variant}>
			<span className={cn("size-1.5 rounded-full", badge.dot)} aria-hidden="true" />
			{badge.label}
		</Badge>
	);
}

const COLUMNS: Column<AdminPaymentLinkData>[] = [
	{ key: "title", label: "Title", render: (link) => link.title },
	{ key: "business", label: "Business", render: (link) => link.business.name },
	{
		key: "amount",
		label: "Amount",
		render: (link) => `${formatUsdc(link.amount)} ${link.currency}`,
	},
	{ key: "status", label: "Status", render: (link) => <StatusPill status={link.status} /> },
	{ key: "expiresAt", label: "Expires", render: (link) => formatDateTime(link.expiresAt) },
	{ key: "createdAt", label: "Created", render: (link) => formatDateTime(link.createdAt) },
];

function PaymentLinksList() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<AdminPaymentLinksQuery["status"] | "all">("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);

	const query: AdminPaymentLinksQuery = {
		q: search.trim() || undefined,
		status: status === "all" ? undefined : status,
	};
	const { data, isLoading, isError } = useAdminPaymentLinks(query, page, pageSize);

	function handleFilterChange<T>(setter: (value: T) => void) {
		return (value: T) => {
			setter(value);
			setPage(1);
		};
	}

	return (
		<div className="flex flex-col gap-4">
			<PaymentLinksFilters
				search={search}
				onSearchChange={handleFilterChange(setSearch)}
				status={status}
				onStatusChange={handleFilterChange(setStatus)}
			/>

			{isLoading || !data ? (
				<ListSkeleton />
			) : isError ? (
				<div className="rounded-2xl border border-border bg-background">
					<DataTable
						columns={COLUMNS}
						rows={[]}
						rowKey={(l) => l.id}
						emptyIcon={ShieldAlert}
						emptyTitle="Couldn't load payment links"
						emptyDescription="Something went wrong. Try refreshing."
					/>
				</div>
			) : (
				<>
					<DataTable
						columns={COLUMNS}
						rows={data.links}
						rowKey={(l) => l.id}
						getRowHref={(l) => `/payment-links/${l.id}`}
						emptyIcon={Link2}
						emptyTitle="No payment links found"
						emptyDescription="Nothing matches your current filters."
					/>
					{data.meta.totalCount > 0 && (
						<Pagination
							page={data.meta.currentPage}
							totalPages={data.meta.pageCount}
							pageSize={pageSize}
							onPageChange={setPage}
							onPageSizeChange={(size) => {
								setPageSize(size);
								setPage(1);
							}}
							pageSizeOptions={PAGE_SIZE_OPTIONS}
							itemsShown={data.links.length}
							total={data.meta.totalCount}
						/>
					)}
				</>
			)}
		</div>
	);
}

export { PaymentLinksList };
