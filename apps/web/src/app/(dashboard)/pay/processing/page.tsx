"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentProcessingStep } from "@/features/pay/components/PaymentProcessingStep";
import { usePayFlowStore } from "@/features/pay/store/payFlowStore";

export default function PaymentProcessingPage() {
	const router = useRouter();
	const values = usePayFlowStore((state) => state.values);

	useEffect(() => {
		if (!values) router.replace("/pay");
	}, [values, router]);

	if (!values) return null;

	return (
		<PaymentProcessingStep
			values={values}
			onSettled={(result) =>
				router.replace(`/pay/${result === "success" ? "success" : "failed"}`)
			}
		/>
	);
}
