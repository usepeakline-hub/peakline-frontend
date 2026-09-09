"use client";

import { Search, Download } from "lucide-react";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { Button } from "@repo/ui/button";
import type { Transaction } from "@/features/dashboard/hooks";

const STATUS_OPTIONS: { value: Transaction["status"] | "all"; label: string }[] = [
	{ value: "all", label: "All statuses" },
	{ value: "pending", label: "Pending" },
	{ value: "completed", label: "Completed" },
	{ value: "failed", label: "Failed" },
];

interface PaymentsFiltersProps {
	search: string;
	onSearchChange: (value: string) => void;
	from: string;
	onFromChange: (value: string) => void;
	to: string;
	onToChange: (value: string) => void;
	status: Transaction["status"] | "all";
	onStatusChange: (value: Transaction["status"] | "all") => void;
	onExport: () => void;
}

/**
 * Search + date range + status filter row, per the mock — the same
 * client-side-only filtering `TransactionFilters` already does (no real
 * search/list endpoint to call yet), extended with a real date range (each
 * fake payment carries a genuine `isoDate`, not just a display string) and
 * a real CSV export of whatever's currently filtered. Native
 * `<input type="date">` rather than the mock's custom-styled calendar
 * trigger — a full popover date picker is a lot of one-off UI for a single
 * filter bar; the platform picker does the same job.
 */
function PaymentsFilters({
	search,
	onSearchChange,
	from,
	onFromChange,
	to,
	onToChange,
	status,
	onStatusChange,
	onExport,
}: PaymentsFiltersProps) {
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
					placeholder="Search by customer name"
					aria-label="Search payments by customer name"
					className="pl-10"
				/>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-b3 text-muted-foreground">From</span>
				<Input
					type="date"
					value={from}
					onChange={(e) => onFromChange(e.target.value)}
					aria-label="From date"
					className="flex-1 lg:w-40 lg:flex-none"
				/>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-b3 text-muted-foreground">To</span>
				<Input
					type="date"
					value={to}
					onChange={(e) => onToChange(e.target.value)}
					aria-label="To date"
					className="flex-1 lg:w-40 lg:flex-none"
				/>
			</div>

			<Select
				value={status}
				onChange={(e) => onStatusChange(e.target.value as Transaction["status"] | "all")}
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

export { PaymentsFilters };
