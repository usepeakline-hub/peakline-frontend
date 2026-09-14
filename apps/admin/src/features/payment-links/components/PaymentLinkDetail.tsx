"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { Skeleton } from "@repo/ui/skeleton";
import { EmptyState } from "@repo/ui/empty-state";
import { Badge } from "@repo/ui/badge";
import { cn } from "@repo/ui/lib/utils";
import { DetailCard, FieldRow } from "@/components/data/DetailCard";
import { useAdminPaymentLink } from "@/features/payment-links/hooks";
import { PaymentLinkActions } from "@/features/payment-links/components/PaymentLinkActions";
import { formatDateTime } from "@/lib/format";
import { formatUsdc } from "@/lib/currency";
import { getApiErrorMessage } from "@/lib/api/errorMessage";
import type { AdminPaymentLinkData } from "@/lib/api/types";

const STATUS_BADGE: Record<
	AdminPaymentLinkData["status"],
	{ variant: "completed" | "failed" | "cancelled"; dot: string; label: string }
> = {
	active: { variant: "completed", dot: "bg-success-600", label: "Active" },
	expired: { variant: "failed", dot: "bg-danger-600", label: "Expired" },
	cancelled: { variant: "cancelled", dot: "bg-neutral-400", label: "Cancelled" },
};

function PaymentLinkDetail({ id }: { id: string }) {
	const { data: link, isLoading, isError, error } = useAdminPaymentLink(id);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Skeleton className="h-80 w-full rounded-2xl" />
				<Skeleton className="h-80 w-full rounded-2xl" />
			</div>
		);
	}

	if (isError || !link) {
		return (
			<div className="rounded-2xl border border-border bg-background">
				<EmptyState
					icon={SearchX}
					title="Payment link not found"
					description={getApiErrorMessage(error, "It may have been removed, or the id is wrong.")}
				/>
			</div>
		);
	}

	const badge = STATUS_BADGE[link.status];

	return (
		<div className="flex flex-col gap-4">
			<PaymentLinkActions link={link} />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<DetailCard title="Payment Link">
					<FieldRow label="Title" value={link.title} />
					<FieldRow
						label="Business"
						value={
							<Link href={`/businesses/${link.business.id}`} className="text-primary-600 hover:underline">
								{link.business.name}
							</Link>
						}
					/>
					<FieldRow label="Amount" value={`${formatUsdc(link.amount)} ${link.currency}`} />
					<FieldRow
						label="Status"
						value={
							<Badge variant={badge.variant}>
								<span className={cn("size-1.5 rounded-full", badge.dot)} aria-hidden="true" />
								{badge.label}
							</Badge>
						}
					/>
					<FieldRow label="Public code" value={<span className="break-all">{link.publicCode}</span>} />
					<FieldRow label="URL" value={<span className="break-all">{link.url}</span>} />
					{link.description && <FieldRow label="Description" value={link.description} />}
					{link.customerReference && (
						<FieldRow label="Customer reference" value={link.customerReference} />
					)}
				</DetailCard>

				<DetailCard title="Timeline">
					<FieldRow label="Created" value={formatDateTime(link.createdAt)} />
					<FieldRow label="Last updated" value={formatDateTime(link.updatedAt)} />
					<FieldRow label="Expires" value={formatDateTime(link.expiresAt)} />
					{link.cancelledAt && <FieldRow label="Cancelled" value={formatDateTime(link.cancelledAt)} />}
				</DetailCard>
			</div>
		</div>
	);
}

export { PaymentLinkDetail };
