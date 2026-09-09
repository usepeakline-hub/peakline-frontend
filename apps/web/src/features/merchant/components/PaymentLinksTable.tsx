"use client";

import { Copy } from "lucide-react";
import { Badge } from "@repo/ui/badge";
import { toast } from "@repo/ui/sonner";
import { formatUsdc } from "@/lib/currency";
import type { PaymentLink, PaymentLinkStatus } from "@/features/merchant/hooks";

// A link's lifecycle isn't a payment's (Pending/Completed/Failed) — reuses
// `Badge`'s existing variant set for a visually consistent pill, just
// mapped to different semantics: active (still awaiting payment) reads as
// an open/neutral state, not a "pending problem", so it gets `outline`
// rather than the amber `pending` used for an actually-stuck payment.
const STATUS_BADGE: Record<PaymentLinkStatus, { variant: "outline" | "completed" | "cancelled"; label: string }> = {
	active: { variant: "outline", label: "Active" },
	paid: { variant: "completed", label: "Paid" },
	expired: { variant: "cancelled", label: "Expired" },
};

async function copyLink(link: string) {
	try {
		await navigator.clipboard.writeText(link);
		toast.success("Link copied");
	} catch {
		toast.error("Couldn't copy");
	}
}

/** A real `<table>`, matching `PaymentsTable`'s own reasoning — reads as a
 * ledger/export-style view. No mobile mock exists; `overflow-x-auto` lets
 * it scroll horizontally there instead of an unreviewed card layout. */
function PaymentLinksTable({ links }: { links: PaymentLink[] }) {
	if (links.length === 0) {
		return (
			<p className="py-8 text-center text-b3 text-muted-foreground">
				No payment links match your filters.
			</p>
		);
	}

	return (
		<div className="overflow-x-auto rounded-xl border border-border">
			<table className="w-full min-w-200 border-collapse text-left">
				<thead>
					<tr className="bg-muted">
						<th className="p-4 text-label text-muted-foreground">Payment Title</th>
						<th className="p-4 text-label text-muted-foreground">Amount (USDC)</th>
						<th className="p-4 text-label text-muted-foreground">Description</th>
						<th className="p-4 text-label text-muted-foreground">Expiration</th>
						<th className="p-4 text-label text-muted-foreground">Customer Reference</th>
						<th className="p-4 text-label text-muted-foreground">Status</th>
						<th className="p-4" />
					</tr>
				</thead>
				<tbody>
					{links.map((paymentLink) => {
						const badge = STATUS_BADGE[paymentLink.status];
						return (
							<tr key={paymentLink.id} className="border-t border-border">
								<td className="p-4 text-b3 font-medium text-foreground">
									{paymentLink.title}
								</td>
								<td className="p-4 text-b3 text-foreground">
									{formatUsdc(paymentLink.amount)} {paymentLink.currency}
								</td>
								<td className="p-4 text-b3 text-muted-foreground">
									{paymentLink.description ?? "—"}
								</td>
								<td className="p-4 text-b3 text-foreground">{paymentLink.expiration}</td>
								<td className="p-4 text-b3 text-muted-foreground">
									{paymentLink.reference ?? "—"}
								</td>
								<td className="p-4">
									<Badge variant={badge.variant}>{badge.label}</Badge>
								</td>
								<td className="p-4">
									<button
										type="button"
										onClick={() => copyLink(paymentLink.link)}
										aria-label={`Copy link for ${paymentLink.title}`}
										className="text-muted-foreground hover:text-foreground"
									>
										<Copy className="size-4" aria-hidden="true" />
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export { PaymentLinksTable };
