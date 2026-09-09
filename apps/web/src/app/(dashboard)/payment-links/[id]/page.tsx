"use client";

import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@repo/ui/skeleton";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaymentLinkDetailCard } from "@/features/merchant/components/PaymentLinkDetailCard";
import { PaymentLinkCreatedCard } from "@/features/merchant/components/PaymentLinkCreatedCard";
import { useMerchantPaymentLinks } from "@/features/merchant/hooks";

/**
 * A payment link's own detail page — reuses `PaymentLinkCreatedCard` for its
 * right-hand share panel (identical to the create page's post-creation
 * state, just titled "Payment Link" instead of "Payment Link Created"), and
 * a dedicated `PaymentLinkDetailCard` for the left receipt-style card (a
 * payment link isn't a `Transaction`, so `TransactionDetail` doesn't fit).
 * No dedicated endpoint for a single link, same pattern as `/payments/[id]`
 * — `useMerchantPaymentLinks` is already cached from the list page, so this
 * just finds the matching entry in it. Desktop's "← Back to Payment Links"
 * comes from `Topbar`'s own breadcrumb (any route nested under
 * `/payment-links`), same as `/payments/[id]`.
 */
export default function PaymentLinkDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const { data } = useMerchantPaymentLinks();

	const link = data?.find((l) => l.id === params.id);

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader
				title="Payment Links"
				onBack={() => router.push("/payment-links")}
			/>
			<PageHeader title="Payment Link" subtitle="View details of this payment link." />

			{!data ? (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
					<Skeleton className="h-72 w-full rounded-2xl" />
					<Skeleton className="h-72 w-full rounded-2xl" />
				</div>
			) : !link ? (
				<p className="py-8 text-center text-b3 text-muted-foreground">
					Payment link not found.
				</p>
			) : (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
					<PaymentLinkDetailCard link={link} />
					<PaymentLinkCreatedCard link={link.link} title="Payment Link" />
				</div>
			)}
		</div>
	);
}
