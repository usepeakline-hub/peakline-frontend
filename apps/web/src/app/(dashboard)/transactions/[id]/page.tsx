"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { TransactionDetail } from "@/features/transactions/components/TransactionDetail";
import { useTransactionHistory } from "@/features/transactions/hooks";
import { Skeleton } from "@repo/ui/skeleton";

/**
 * No dedicated endpoint for a single transaction — `useTransactionHistory`
 * is already cached from the list page (same query key), so this just
 * finds the matching entry in it. A direct visit/refresh with nothing
 * cached yet still works, just re-fetches the full list first.
 *
 * The desktop mock shows "← Back to Transactions" sitting inside the same
 * bar as the notification bell/avatar (i.e. inside the shared `Topbar`).
 * Threading page-specific content into a layout-level component shared by
 * every dashboard route isn't worth the cross-cutting complexity for one
 * screen, so this renders its own back-link at the top of the page content
 * instead — same destination, simpler wiring.
 */
export default function TransactionDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const { data } = useTransactionHistory();

	const transaction = data?.find((t) => t.id === params.id);

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader
				title="Transactions"
				onBack={() => router.push("/transactions")}
			/>
			<button
				type="button"
				onClick={() => router.push("/transactions")}
				className="hidden items-center gap-2 text-b3 font-medium text-foreground hover:text-primary-600 lg:flex"
			>
				<ChevronLeft className="size-4" aria-hidden="true" />
				Back to Transactions
			</button>

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
			) : (
				<TransactionDetail transaction={transaction} />
			)}
		</div>
	);
}
