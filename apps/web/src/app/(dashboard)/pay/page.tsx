"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ScanMerchantCard } from "@/features/pay/components/ScanMerchantCard";
import { MerchantPaymentCard } from "@/features/pay/components/MerchantPaymentCard";
import { useScanMerchantQr } from "@/features/pay/hooks";
import { usePayFlowStore } from "@/features/pay/store/payFlowStore";
import type { FakeMerchant } from "@/lib/pay";

export default function PayPage() {
	const router = useRouter();
	const [merchant, setMerchant] = useState<FakeMerchant | null>(null);
	const scanMerchant = useScanMerchantQr();
	const setValues = usePayFlowStore((state) => state.setValues);

	function handleScan() {
		scanMerchant.mutate(undefined, { onSuccess: (result) => setMerchant(result) });
	}

	function handleContinue(amount: number) {
		if (!merchant) return;
		setValues({ merchant, amount });
		router.push("/pay/confirm");
	}

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader title="Pay" onBack={() => router.back()} />
			{/* The mock's own subtitle here was copy-pasted from Receive ("...to
			    receive payments") — written fresh for what this page actually
			    does. */}
			<PageHeader title="Pay" subtitle="Scan a merchant's QR code to pay instantly." />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
				{/* Desktop: scan card always visible alongside the merchant card.
				    Mobile: replaced entirely once a merchant is found — there's no
				    room (or a mock) for both at once on a small screen. */}
				<div className={merchant ? "hidden lg:block" : ""}>
					<ScanMerchantCard onScan={handleScan} loading={scanMerchant.isPending} />
				</div>
				<div className={!merchant ? "hidden lg:block" : ""}>
					<MerchantPaymentCard merchant={merchant} onContinue={handleContinue} />
				</div>
			</div>
		</div>
	);
}
