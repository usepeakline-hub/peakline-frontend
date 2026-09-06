"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { RequestPaymentForm } from "@/features/request-payment/components/RequestPaymentForm";
import { PaymentRequestCreatedCard } from "@/features/request-payment/components/PaymentRequestCreatedCard";

export default function RequestPaymentPage() {
	const router = useRouter();
	const [link, setLink] = useState<string | null>(null);

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			{/* Back arrow kept — reached by drilling in (Quick Actions, the
			    Transactions hub, or the Sidebar), not a primary bottom-tab
			    destination. */}
			<MobileStepHeader title="Request Payment" onBack={() => router.back()} />
			<PageHeader title="Request Payment" subtitle="Create a payment request and share the link" />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
				<RequestPaymentForm onCreated={setLink} />
				{link && <PaymentRequestCreatedCard link={link} />}
			</div>
		</div>
	);
}
