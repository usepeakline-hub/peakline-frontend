"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@repo/ui/badge";
import { cn } from "@repo/ui/lib/utils";
import { formatUsdc } from "@/lib/currency";
import type { PaymentLink, PaymentLinkStatus } from "@/features/merchant/hooks";

// A link's lifecycle isn't a payment's (Pending/Completed/Failed), but the
// mock's own pills read identically to `StatusBadge`'s dot+pill convention
// (green for Active, red for Expired) — reusing `Badge`'s existing
// completed/failed color variants for that same look rather than adding a
// third status vocabulary to the shared component. "Paid" (a link that's
// already been used) reads the same green as Active — a distinct label is
// enough to tell them apart, same principle as `StatusBadge` itself never
// needing a unique color per state.
const STATUS_BADGE: Record<
	PaymentLinkStatus,
	{ variant: "completed" | "failed"; dot: string; label: string }
> = {
	active: { variant: "completed", dot: "bg-success-600", label: "Active" },
	paid: { variant: "completed", dot: "bg-success-600", label: "Paid" },
	expired: { variant: "failed", dot: "bg-danger-600", label: "Expired" },
};

function StatusPill({ status }: { status: PaymentLinkStatus }) {
	const badge = STATUS_BADGE[status];
	return (
		<Badge variant={badge.variant}>
			<span className={cn("size-1.5 rounded-full", badge.dot)} aria-hidden="true" />
			{badge.label}
		</Badge>
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
 * A real `<table>` on desktop — Title, Amount, Created, Expires, Status,
 * then a dedicated Action column with an eye icon linking to the link's own
 * detail page, matching `PaymentsTable`'s exact convention (the two lists
 * were rebuilt from near-identical mocks). Stacked cards on mobile, same
 * field set, eye icon pinned to each card's own bottom-right corner.
 */
function PaymentLinksTable({ links }: { links: PaymentLink[] }) {
	if (links.length === 0) {
		return (
			<p className="py-8 text-center text-b3 text-muted-foreground">
				No payment links match your filters.
			</p>
		);
	}

	return (
		<>
			<div className="hidden overflow-x-auto rounded-xl border border-border lg:block">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="bg-muted">
							<th className="p-4 text-label text-muted-foreground">Title</th>
							<th className="p-4 text-label text-muted-foreground">Amount (USDC)</th>
							<th className="p-4 text-label text-muted-foreground">Created</th>
							<th className="p-4 text-label text-muted-foreground">Expires</th>
							<th className="p-4 text-label text-muted-foreground">Status</th>
							<th className="p-4 text-label text-muted-foreground">Action</th>
						</tr>
					</thead>
					<tbody>
						{links.map((link) => (
							<tr key={link.id} className="border-t border-border hover:bg-muted/50">
								<td className="p-4 text-b3 font-medium text-foreground">{link.title}</td>
								<td className="p-4 text-b3 text-foreground">
									{formatUsdc(link.amount)} {link.currency}
								</td>
								<td className="p-4 text-b3 text-foreground">{link.created}</td>
								<td className="p-4 text-b3 text-foreground">{link.expiration}</td>
								<td className="p-4">
									<StatusPill status={link.status} />
								</td>
								<td className="p-4">
									<Link
										href={`/payment-links/${link.id}`}
										aria-label={`View payment link "${link.title}"`}
										className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									>
										<Eye className="size-4" aria-hidden="true" />
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col gap-3 lg:hidden">
				{links.map((link) => (
					<div key={link.id} className="flex flex-col gap-3 rounded-xl border border-border p-4">
						<CardRow label="Title" value={link.title} />
						<CardRow label="Amount (USDC)" value={`${formatUsdc(link.amount)} ${link.currency}`} />
						<CardRow label="Created" value={link.created} />
						<CardRow label="Expires" value={link.expiration} />
						<CardRow label="Status" value={<StatusPill status={link.status} />} />
						<div className="flex justify-end">
							<Link
								href={`/payment-links/${link.id}`}
								aria-label={`View payment link "${link.title}"`}
								className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<Eye className="size-4" aria-hidden="true" />
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export { PaymentLinksTable };
