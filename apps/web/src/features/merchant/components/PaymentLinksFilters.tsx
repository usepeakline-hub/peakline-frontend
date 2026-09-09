"use client";

import { Search, Download } from "lucide-react";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { Button } from "@repo/ui/button";
import type { PaymentLinkStatus } from "@/features/merchant/hooks";

const STATUS_OPTIONS: { value: PaymentLinkStatus | "all"; label: string }[] = [
	{ value: "all", label: "All statuses" },
	{ value: "active", label: "Active" },
	{ value: "paid", label: "Paid" },
	{ value: "expired", label: "Expired" },
];

interface PaymentLinksFiltersProps {
	search: string;
	onSearchChange: (value: string) => void;
	from: string;
	onFromChange: (value: string) => void;
	to: string;
	onToChange: (value: string) => void;
	status: PaymentLinkStatus | "all";
	onStatusChange: (value: PaymentLinkStatus | "all") => void;
	onExport: () => void;
}

/** Same filter bar shape as `PaymentsFilters` — kept as its own component
 * rather than a shared generic one since the two status vocabularies
 * genuinely differ (a payment link's lifecycle isn't a payment's). Filters
 * on title, not customer name — payment links aren't tied to a payer until
 * someone actually pays them. */
function PaymentLinksFilters({
	search,
	onSearchChange,
	from,
	onFromChange,
	to,
	onToChange,
	status,
	onStatusChange,
	onExport,
}: PaymentLinksFiltersProps) {
	return (
		<div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
			<div className="relative flex-1 lg:min-w-48">
				<Search
					className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
					aria-hidden="true"
				/>
				<Input
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search by payment title"
					aria-label="Search payment links by title"
					className="pl-10"
				/>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-b3 text-muted-foreground">From</span>
				<Input
					type="date"
					value={from}
					onChange={(e) => onFromChange(e.target.value)}
					aria-label="From expiration date"
					className="flex-1 lg:w-40 lg:flex-none"
				/>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-b3 text-muted-foreground">To</span>
				<Input
					type="date"
					value={to}
					onChange={(e) => onToChange(e.target.value)}
					aria-label="To expiration date"
					className="flex-1 lg:w-40 lg:flex-none"
				/>
			</div>

			<Select
				value={status}
				onChange={(e) => onStatusChange(e.target.value as PaymentLinkStatus | "all")}
				aria-label="Filter by status"
				className="lg:w-44"
			>
				{STATUS_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</Select>

			<Button type="button" variant="outline" onClick={onExport}>
				<Download className="size-4" aria-hidden="true" />
				Export CSV
			</Button>
		</div>
	);
}

export { PaymentLinksFilters };
