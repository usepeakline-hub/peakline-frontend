import type { Metadata } from "next";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { WalletBalanceCard } from "@/features/wallet/components/WalletBalanceCard";
import { WalletAddressCard } from "@/features/wallet/components/WalletAddressCard";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentTransactions } from "@/features/dashboard/components/RecentTransactions";

export const metadata: Metadata = {
	title: "My Wallet — Peakline",
};

export default function WalletPage() {
	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader title="My Wallet" />
			<WalletBalanceCard />
			<WalletAddressCard />
			<div className="flex flex-col gap-3 sm:gap-4">
				<h2 className="text-s1 text-foreground sm:text-h5">Quick Actions</h2>
				<QuickActions />
			</div>
			<RecentTransactions />
		</div>
	);
}
