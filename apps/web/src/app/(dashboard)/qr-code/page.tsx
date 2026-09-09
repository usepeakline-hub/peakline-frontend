import type { Metadata } from "next";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { QrCodeCard } from "@/features/merchant/components/QrCodeCard";

export const metadata: Metadata = {
	title: "My QR Code — Peakline",
};

// Merchant-only — now a primary sidebar/drawer destination ("My QR Code"),
// not just reachable via Overview's "Show QR" quick action, so no back
// arrow (same as Wallet/Payments/Payment Links).
export default function QrCodePage() {
	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader title="My QR Code" />
			<PageHeader title="My QR Code" subtitle="Receive payments via your QR code" />
			<QrCodeCard />
		</div>
	);
}
