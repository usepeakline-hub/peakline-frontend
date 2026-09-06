"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentFailedStep } from "@/features/pay/components/PaymentFailedStep";
import { usePayFlowStore } from "@/features/pay/store/payFlowStore";

export default function PaymentFailedPage() {
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

	return (
		<PaymentFailedStep
			values={values}
			onTryAgain={() => router.push("/pay/confirm")}
			onGoToDashboard={goToDashboard}
		/>
	);
}
