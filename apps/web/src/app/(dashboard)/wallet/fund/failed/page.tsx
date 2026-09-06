"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { FundingFailedStep } from "@/features/wallet/components/FundingFailedStep";
import { useFundWalletFlowStore } from "@/features/wallet/store/fundWalletFlowStore";

export default function FundingFailedPage() {
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

	return (
		<div className="flex flex-col gap-6">
			<MobileStepHeader title="Fund Wallet" onBack={goToDashboard} />
			<FundingFailedStep
				values={values}
				onTryAgain={() => router.push("/wallet/fund/confirm")}
				onGoToDashboard={goToDashboard}
			/>
		</div>
	);
}
