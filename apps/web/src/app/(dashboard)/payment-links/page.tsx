import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/button";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaymentLinksList } from "@/features/merchant/components/PaymentLinksList";

export const metadata: Metadata = {
	title: "Payment Links — Peakline",
};

// Merchant-only route, replacing "Request Payment" in that nav (see
// Sidebar) — same no-route-guard-yet caveat as `/payments`.
export default function PaymentLinksPage() {
	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			{/* No back arrow — primary sidebar destination, same as /payments. */}
			<MobileStepHeader title="Payment Links" />
			<PageHeader
				title="Payment Links"
				subtitle="Create and manage reusable payment links for your customers"
				action={
					<Button asChild size="large">
						<Link href="/payment-links/create">
							<Plus className="size-4" aria-hidden="true" />
							Create Payment Link
						</Link>
					</Button>
				}
			/>
			{/* Mobile equivalent of the desktop-only action above — no mock shows
			    a mobile take on this page, but leaving mobile with no way to
			    start one from here would be a real gap, not just a cosmetic one. */}
			<Button asChild size="large" className="w-full lg:hidden">
				<Link href="/payment-links/create">
					<Plus className="size-4" aria-hidden="true" />
					Create Payment Link
				</Link>
			</Button>
			<PaymentLinksList />
		</div>
	);
}
