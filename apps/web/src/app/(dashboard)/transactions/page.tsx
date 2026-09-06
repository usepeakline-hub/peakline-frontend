"use client";

import { useRouter } from "next/navigation";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { TransferActions } from "@/features/transactions/components/TransferActions";
import { TransactionHistoryList } from "@/features/transactions/components/TransactionHistoryList";

export default function TransactionsPage() {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader title="Transactions" onBack={() => router.back()} />
			<PageHeader title="Transactions" subtitle="View your transaction history" />
			<TransferActions />
			<TransactionHistoryList />
		</div>
	);
}
