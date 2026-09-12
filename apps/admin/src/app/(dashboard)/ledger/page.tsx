import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/layouts/ComingSoonPage";

export const metadata: Metadata = { title: "Ledger — Peakline Admin" };

export default function LedgerPage() {
	return <ComingSoonPage title="Ledger" phase="Phase 3" />;
}
