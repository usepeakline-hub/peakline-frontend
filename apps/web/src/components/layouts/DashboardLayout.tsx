"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomTabBar } from "./BottomTabBar";
import { MerchantMobileTopBar } from "./MerchantMobileTopBar";
import { useAuthStore } from "@/lib/stores/authStore";
import { cn } from "@repo/ui/lib/utils";

interface DashboardLayoutProps {
	children: React.ReactNode;
	/** TODO: source from the authenticated session once one exists. */
	userName?: string;
	notificationCount?: number;
}

/**
 * Persistent dashboard shell. Two distinct treatments per the mock, not one
 * responsively-scaled layout: mobile is a flat white page (no topbar, no
 * floating content card — the account avatar moves into the page's own
 * greeting row instead, see `GreetingHeader`) with `BottomTabBar` for nav;
 * `lg` and up brings in the `Sidebar`, a muted page background, and the
 * topbar + content both floating as rounded cards.
 *
 * Merchant is a third treatment on mobile specifically — `MerchantMobileTopBar`
 * (self-branching, renders nothing for individual) replaces the flat page's
 * missing topbar with a "Merchant" badge + hamburger menu, and `BottomTabBar`
 * itself renders nothing for merchant (no bottom nav at all there anymore).
 *
 * `Sidebar` is `fixed` (see its own comment for why), so it no longer
 * claims space in this flex row — `lg:ml-65` on the content column reserves
 * the same width by hand instead.
 */
function DashboardLayout({
	children,
	userName = "John Doe",
	// TODO: source from a real notifications feed once one exists — every
	// provided mock shows the bell badge active, so this defaults to a
	// nonzero fake count rather than 0 (which would hide it, contradicting
	// every screenshot).
	notificationCount = 10,
}: DashboardLayoutProps) {
	// Merchant has no `BottomTabBar` to leave room for (nav is the sidebar
	// drawer instead) — the extra bottom padding here exists purely to clear
	// that bar, so it'd otherwise be dead space at the bottom of every
	// merchant page.
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");

	return (
		<div className="flex min-h-screen bg-background lg:bg-muted">
			<Sidebar />
			<div
				className={cn(
					"flex min-w-0 flex-1 flex-col gap-4 p-4 lg:ml-65 lg:p-6",
					!isMerchant && "pb-24",
				)}
			>
				<Topbar
					userName={userName}
					notificationCount={notificationCount}
					className="hidden lg:flex"
				/>
				<MerchantMobileTopBar />
				<main className="flex-1 lg:rounded-2xl lg:bg-background lg:p-8 lg:shadow-xs">
					{children}
				</main>
			</div>
			<BottomTabBar />
		</div>
	);
}

export { DashboardLayout };
