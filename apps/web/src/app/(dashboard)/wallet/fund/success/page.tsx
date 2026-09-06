"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { FundingSuccessStep } from "@/features/wallet/components/FundingSuccessStep";
import { useFundWalletFlowStore } from "@/features/wallet/store/fundWalletFlowStore";

export default function FundingSuccessPage() {
	const router = useRouter();
	const values = useFundWalletFlowStore((state) => state.values);
	const reset = useFundWalletFlowStore((state) => state.reset);

	useEffect(() => {
		if (!values) router.replace("/wallet/fund");
	}, [values, router]);

	if (!values) return null;

	function goToDashboard() {
		reset();
		router.push("/");
	}

	function viewTransactions() {
		reset();
		router.push("/transactions");
	}

	return (
		<div className="flex flex-col gap-6">
			<MobileStepHeader title="Fund Wallet" onBack={goToDashboard} />
			<FundingSuccessStep
				values={values}
				onGoToDashboard={goToDashboard}
				onViewTransactions={viewTransactions}
			/>
		</div>
	);
}
