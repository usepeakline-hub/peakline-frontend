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
		<div className="flex flex-col gap-6">
			<FundingProcessingStep
				values={values}
				onSettled={(result) =>
					router.replace(`/wallet/fund/${result === "success" ? "success" : "failed"}`)
				}
			/>
		</div>
	);
}
