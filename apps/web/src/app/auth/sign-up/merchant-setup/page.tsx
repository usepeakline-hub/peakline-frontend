import type { Metadata } from "next";
import { MerchantSetupForm } from "@/features/auth/components/MerchantSetupForm";

export const metadata: Metadata = {
	title: "Set up your merchant account — Peakline",
};

export default function MerchantSetupPage() {
	return <MerchantSetupForm />;
}
