import type { Metadata } from "next";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaymentsList } from "@/features/merchant/components/PaymentsList";

export const metadata: Metadata = {
	title: "Payments — Peakline",
};

// Merchant-only route (no individual nav item links here) — no route guard
// exists yet, matching every other dashboard route today; gating is by nav
// visibility only, per CLAUDE.md's Monorepo layout note on merchant.
export default function PaymentsPage() {
	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			{/* No back arrow — primary sidebar destination, same as /wallet. */}
			<MobileStepHeader title="Payments" />
			<PageHeader title="Payments" subtitle="All incoming payments" />
			<PaymentsList />
		</div>
	);
}
