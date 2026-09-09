import type { Metadata } from "next";
import { PageHeader } from "@/components/layouts/PageHeader";
import { QrCodeCard } from "@/features/merchant/components/QrCodeCard";

export const metadata: Metadata = {
	title: "My QR Code — Peakline",
};

// Merchant-only — now a primary sidebar/drawer destination ("My QR Code"),
// not just reachable via Overview's "Show QR" quick action, so no back
// arrow (same as Wallet/Payments/Payment Links). The page's own H1 reads
// "QR Code" (not "My QR Code") per the mock — the nav item and the page
// title are allowed to differ, same distinction the mock itself draws.
//
// No `MobileStepHeader` here — `MerchantMobileTopBar` already shows
// "My QR Code" as a back+title+hamburger bar for this exact route, same as
// `/payments`.
export default function QrCodePage() {
	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<PageHeader title="QR Code" subtitle="Receive payments via your QR code" />
			<QrCodeCard />
		</div>
	);
}
