"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TransferSuccessStep } from "@/features/send/components/TransferSuccessStep";
import { useSendMoneyFlowStore } from "@/features/send/store/sendMoneyFlowStore";

export default function TransferSuccessPage() {
	const router = useRouter();
	const values = useSendMoneyFlowStore((state) => state.values);
	const reset = useSendMoneyFlowStore((state) => state.reset);

	useEffect(() => {
		if (!values) router.replace("/send");
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
		<TransferSuccessStep
			values={values}
			onGoToDashboard={goToDashboard}
			onViewTransactions={viewTransactions}
		/>
	);
}
