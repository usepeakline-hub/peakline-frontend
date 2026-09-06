"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentSuccessStep } from "@/features/pay/components/PaymentSuccessStep";
import { usePayFlowStore } from "@/features/pay/store/payFlowStore";

export default function PaymentSuccessPage() {
	const router = useRouter();
	const values = usePayFlowStore((state) => state.values);
	const reset = usePayFlowStore((state) => state.reset);

	useEffect(() => {
		if (!values) router.replace("/pay");
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
		<PaymentSuccessStep
			values={values}
			onGoToDashboard={goToDashboard}
			onViewTransactions={viewTransactions}
		/>
	);
}
