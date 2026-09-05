import type { Metadata } from "next";
import { TwoFactorMethodForm } from "@/features/auth/components/TwoFactorMethodForm";

export const metadata: Metadata = {
	title: "Verify it's you — Peakline",
};

export default function TwoFactorPage() {
	return <TwoFactorMethodForm />;
}
