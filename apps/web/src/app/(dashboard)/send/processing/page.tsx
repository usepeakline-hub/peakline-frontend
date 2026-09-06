"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TransferProcessingStep } from "@/features/send/components/TransferProcessingStep";
import { useSendMoneyFlowStore } from "@/features/send/store/sendMoneyFlowStore";

export default function TransferProcessingPage() {
	const router = useRouter();
	const values = useSendMoneyFlowStore((state) => state.values);

	useEffect(() => {
		if (!values) router.replace("/send");
	}, [values, router]);

	if (!values) return null;

	return (
		<TransferProcessingStep
			values={values}
			onSettled={(result) =>
				router.replace(`/send/${result === "success" ? "success" : "failed"}`)
			}
		/>
	);
}
