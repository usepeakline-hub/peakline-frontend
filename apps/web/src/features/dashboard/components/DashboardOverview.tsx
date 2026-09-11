"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { GreetingHeader } from "@/features/dashboard/components/GreetingHeader";
import { BalanceCard } from "@/features/dashboard/components/BalanceCard";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentTransactions } from "@/features/dashboard/components/RecentTransactions";
import { MerchantStatsCards } from "@/features/merchant/components/MerchantStatsCards";
import { MerchantQuickActions } from "@/features/merchant/components/MerchantQuickActions";
import { TotalReceivedChart } from "@/features/merchant/components/TotalReceivedChart";
import { RecentPaymentsSection } from "@/features/merchant/components/RecentPaymentsSection";

/**
 * The dashboard's home route (`/`) branches by account type rather than
 * living at two different URLs — merchant is a permission on this same
 * `apps/web`, not a separate app (see CLAUDE.md's Monorepo layout).
 *
 * Merchant's own hero further branches by *breakpoint*, per the updated
 * mock: desktop keeps the original 3 stat cards (Total Received/Today's
 * Payments/Pending), but mobile swaps them for the same "Available
 * Balance" card individual uses (without the Send action — see
 * `BalanceCard`'s own note) — a deliberate per-breakpoint content
 * difference, not just a responsive reflow of the same content. Both
 * breakpoints get the new "Total Received" trend chart and the paginated
 * "Recent Payments" table/cards below Quick Actions, replacing the plain
 * `RecentTransactions` reuse merchant had before.
 */
function DashboardOverview() {
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<GreetingHeader />

			{isMerchant ? (
				<>
					<div className="hidden lg:block">
						<MerchantStatsCards />
					</div>
					<BalanceCard className="lg:hidden" />

					<div className="flex flex-col gap-3 sm:gap-4">
						<h2 className="text-s1 text-foreground sm:text-h5">Quick Actions</h2>
						<MerchantQuickActions />
					</div>

					<TotalReceivedChart />
					<RecentPaymentsSection />
				</>
			) : (
				<>
					<BalanceCard />
					<div className="flex flex-col gap-3 sm:gap-4">
						<h2 className="text-s1 text-foreground sm:text-h5">Quick Actions</h2>
						<QuickActions />
					</div>
					<RecentTransactions />
				</>
			)}
		</div>
	);
}

export { DashboardOverview };
