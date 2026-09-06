"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TransferFailedStep } from "@/features/send/components/TransferFailedStep";
import { useSendMoneyFlowStore } from "@/features/send/store/sendMoneyFlowStore";

export default function TransferFailedPage() {
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

	return (
		<TransferFailedStep
			values={values}
			onTryAgain={() => router.push("/send/review")}
			onGoToDashboard={goToDashboard}
		/>
	);
}
