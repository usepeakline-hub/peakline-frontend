"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@repo/ui/skeleton";
import { toast } from "@repo/ui/sonner";
import { useMerchantPaymentLinks } from "@/features/merchant/hooks";
import { PaymentLinksFilters } from "@/features/merchant/components/PaymentLinksFilters";
import { PaymentLinksTable } from "@/features/merchant/components/PaymentLinksTable";
import type { PaymentLink, PaymentLinkStatus } from "@/features/merchant/hooks";

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
	const header = [
		"Payment Title",
		"Amount (USDC)",
		"Description",
		"Expiration",
		"Customer Reference",
		"Status",
		"Link",
	];
	const rows = links.map((link) => [
		link.title,
		link.amount.toFixed(2),
		link.description ?? "",
		link.expiration,
		link.reference ?? "",
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
 * `PaymentsList`. */
function PaymentLinksList() {
	const { data } = useMerchantPaymentLinks();
	const [search, setSearch] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [status, setStatus] = useState<PaymentLinkStatus | "all">("all");

	const filtered = useMemo(() => {
		if (!data) return null;
		return data.filter(
			(link) =>
				matchesSearch(link, search) &&
				matchesDateRange(link, from, to) &&
				(status === "all" || link.status === status),
		);
	}, [data, search, from, to, status]);

	function handleExport() {
		if (!filtered || filtered.length === 0) {
			toast.error("No payment links to export");
			return;
		}
		downloadCsv(filtered);
		toast.success("Payment links exported");
	}

	return (
		<div className="flex flex-col gap-4">
			<PaymentLinksFilters
				search={search}
				onSearchChange={setSearch}
				from={from}
				onFromChange={setFrom}
				to={to}
				onToChange={setTo}
				status={status}
				onStatusChange={setStatus}
				onExport={handleExport}
			/>

			{!filtered ? <PaymentLinksListSkeleton /> : <PaymentLinksTable links={filtered} />}
		</div>
	);
}

export { PaymentLinksList };
