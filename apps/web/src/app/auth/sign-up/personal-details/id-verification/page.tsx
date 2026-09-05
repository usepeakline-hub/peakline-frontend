import type { Metadata } from "next";
import { IdVerificationForm } from "@/features/auth/components/IdVerificationForm";

export const metadata: Metadata = {
	title: "Verify your identity — Peakline",
};

export default function IdVerificationPage() {
	return <IdVerificationForm />;
}
