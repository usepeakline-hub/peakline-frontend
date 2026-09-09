"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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
 * "← Back to Payments" link and the identity for the paying customer's —
 * skipped here, same call `TransactionDetailPage` already made for its own
 * near-identical mock: threading page-specific content into the shared
 * `Topbar` isn't worth it for one screen, and the customer's name/phone
 * already appear in the page body's "From" row regardless.
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
			<button
				type="button"
				onClick={() => router.push("/payments")}
				className="hidden items-center gap-2 text-b3 font-medium text-foreground hover:text-primary-600 lg:flex"
			>
				<ChevronLeft className="size-4" aria-hidden="true" />
				Back to Payments
			</button>

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
