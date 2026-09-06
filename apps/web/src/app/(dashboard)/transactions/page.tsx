import type { Metadata } from "next";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { TransferActions } from "@/features/transactions/components/TransferActions";
import { TransactionHistoryList } from "@/features/transactions/components/TransactionHistoryList";

export const metadata: Metadata = {
	title: "Transactions — Peakline",
};

export default function TransactionsPage() {
	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			{/* No back arrow — this is a primary bottom-tab destination, same as
			    /wallet, with nowhere obvious to go "back" to. */}
			<MobileStepHeader title="Transactions" />
			<PageHeader title="Transactions" subtitle="View your transaction history" />
			<TransferActions />
			<TransactionHistoryList />
		</div>
	);
}
