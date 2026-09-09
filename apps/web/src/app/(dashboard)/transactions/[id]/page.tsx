"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { TransactionDetail } from "@/features/transactions/components/TransactionDetail";
import { useTransactionHistory } from "@/features/transactions/hooks";
import { useMerchantTransactions } from "@/features/merchant/hooks";
import { useAuthStore } from "@/lib/stores/authStore";
import { Skeleton } from "@repo/ui/skeleton";

/**
 * No dedicated endpoint for a single transaction — looks the id up in
 * whichever list is already cached for this account type
 * (`useMerchantTransactions` for merchant, `useTransactionHistory` for
 * individual — both cheap fake queries, so calling both unconditionally
 * and picking one is simpler than gating either with `enabled`). A direct
 * visit/refresh with nothing cached yet still works, just re-fetches the
 * full list first.
 *
 * The desktop mock shows "← Back to Transactions" sitting inside the same
 * bar as the notification bell/avatar — `Topbar` itself now provides this
 * centrally for a merchant session (any route nested under a top-level nav
 * item, see its own `parentBreadcrumb`), so only the individual branch
 * still needs this page's own copy of that link; individual's `Topbar`
 * never shows the badge/breadcrumb row at all.
 */
export default function TransactionDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");
	const { data: individualData } = useTransactionHistory();
	const { data: merchantData } = useMerchantTransactions();
	const data = isMerchant ? merchantData : individualData;

	const transaction = data?.find((t) => t.id === params.id);

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader
				title="Transactions"
				onBack={() => router.push("/transactions")}
			/>
			{!isMerchant && (
				<button
					type="button"
					onClick={() => router.push("/transactions")}
					className="hidden items-center gap-2 text-b3 font-medium text-foreground hover:text-primary-600 lg:flex"
				>
					<ChevronLeft className="size-4" aria-hidden="true" />
					Back to Transactions
				</button>
			)}

			{!data ? (
				<div className="flex flex-col gap-6">
					<Skeleton className="h-24 w-full rounded-2xl" />
					<Skeleton className="h-20 w-full rounded-xl" />
					<Skeleton className="h-32 w-full rounded-xl" />
				</div>
			) : !transaction ? (
				<p className="py-8 text-center text-b3 text-muted-foreground">
					Transaction not found.
				</p>
			) : isMerchant ? (
				// Every merchant "transaction" is a received payment (same
				// dataset `useMerchantPayments` draws from) — "Payment"/"From",
				// matching `/payments/[id]`'s own wording, not the default
				// "Transfer"/"To" individual's mixed sent-and-received history
				// uses.
				<TransactionDetail transaction={transaction} noun="Payment" counterpartyLabel="From" />
			) : (
				<TransactionDetail transaction={transaction} />
			)}
		</div>
	);
}
