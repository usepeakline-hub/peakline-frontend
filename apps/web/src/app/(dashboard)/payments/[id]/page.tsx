"use client";

import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@repo/ui/skeleton";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { TransactionDetail } from "@/features/transactions/components/TransactionDetail";
import { useMerchantPayments } from "@/features/merchant/hooks";

/**
 * A payment's own receipt page — reuses `TransactionDetail` wholesale
 * (`noun="Payment"`, `counterpartyLabel="From"`) rather than duplicating
 * its banner/amount/detail-row layout. No dedicated endpoint for a single
 * payment, same as `/transactions/[id]` — `useMerchantPayments` is already
 * cached from the list page (same query key), so this just finds the
 * matching entry in it.
 *
 * The mock's desktop top bar swaps the "Merchant" badge for a
 * "← Back to Payments" link — `Topbar` itself now does this centrally for
 * any route nested under a top-level nav item (see its own
 * `parentBreadcrumb`), so this page no longer needs its own desktop copy of
 * that link; only the mobile header (a different component, `Topbar` is
 * `lg`-only) still needs its own `onBack`.
 */
export default function PaymentDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const { data } = useMerchantPayments();

	const payment = data?.find((p) => p.id === params.id);

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader
				title="Payments"
				onBack={() => router.push("/payments")}
			/>

			{!data ? (
				<div className="flex flex-col gap-6">
					<Skeleton className="h-24 w-full rounded-2xl" />
					<Skeleton className="h-20 w-full rounded-xl" />
					<Skeleton className="h-32 w-full rounded-xl" />
				</div>
			) : !payment ? (
				<p className="py-8 text-center text-b3 text-muted-foreground">
					Payment not found.
				</p>
			) : (
				<TransactionDetail transaction={payment} noun="Payment" counterpartyLabel="From" />
			)}
		</div>
	);
}
