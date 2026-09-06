"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { ConfirmPaymentStep } from "@/features/pay/components/ConfirmPaymentStep";
import { usePayFlowStore } from "@/features/pay/store/payFlowStore";

export default function ConfirmPaymentPage() {
	const router = useRouter();
	const values = usePayFlowStore((state) => state.values);

	// Reached without a merchant/amount chosen in this session — send back.
	useEffect(() => {
		if (!values) router.replace("/pay");
	}, [values, router]);

	if (!values) return null;

	return (
		<div className="flex flex-col gap-6">
			<MobileStepHeader title="Pay" onBack={() => router.push("/pay")} />
			<ConfirmPaymentStep values={values} onContinue={() => router.push("/pay/processing")} />
		</div>
	);
}
