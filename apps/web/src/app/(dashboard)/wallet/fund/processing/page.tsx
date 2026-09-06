"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FundingProcessingStep } from "@/features/wallet/components/FundingProcessingStep";
import { useFundWalletFlowStore } from "@/features/wallet/store/fundWalletFlowStore";

export default function FundingProcessingPage() {
	const router = useRouter();
	const values = useFundWalletFlowStore((state) => state.values);

	useEffect(() => {
		if (!values) router.replace("/wallet/fund");
	}, [values, router]);

	if (!values) return null;

	return (
		<FundingProcessingStep
			values={values}
			onSettled={(result) =>
				router.replace(`/wallet/fund/${result === "success" ? "success" : "failed"}`)
			}
		/>
	);
}
