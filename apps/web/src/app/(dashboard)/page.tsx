import type { Metadata } from "next";
import { GreetingHeader } from "@/features/dashboard/components/GreetingHeader";
import { BalanceCard } from "@/features/dashboard/components/BalanceCard";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentTransactions } from "@/features/dashboard/components/RecentTransactions";

export const metadata: Metadata = {
	title: "Dashboard — Peakline",
};

export default function DashboardPage() {
	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<GreetingHeader />
			<BalanceCard />
			<div className="flex flex-col gap-3 sm:gap-4">
				<h2 className="text-s1 text-foreground sm:text-h5">Quick Actions</h2>
				<QuickActions />
			</div>
			<RecentTransactions />
		</div>
	);
}
