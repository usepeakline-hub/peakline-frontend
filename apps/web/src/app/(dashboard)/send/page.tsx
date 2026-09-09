"use client";

import { useRouter } from "next/navigation";
import { SendStepHeader } from "@/features/send/components/SendStepHeader";
import { SendMoneyFormStep } from "@/features/send/components/SendMoneyFormStep";
import { useSendMoneyFlowStore } from "@/features/send/store/sendMoneyFlowStore";

export default function SendMoneyPage() {
	const router = useRouter();
	const values = useSendMoneyFlowStore((state) => state.values);
	const setValues = useSendMoneyFlowStore((state) => state.setValues);

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<SendStepHeader step={1} onBack={() => router.back()} />
			<SendMoneyFormStep
				defaultValues={values}
				onContinue={(submitted) => {
					setValues(submitted);
					router.push("/send/review");
				}}
			/>
		</div>
	);
}
