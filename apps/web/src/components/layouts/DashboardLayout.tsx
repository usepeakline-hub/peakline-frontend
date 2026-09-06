import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomTabBar } from "./BottomTabBar";

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
 */
function DashboardLayout({
	children,
	userName = "John Doe",
	notificationCount = 0,
}: DashboardLayoutProps) {
	return (
		<div className="flex min-h-screen bg-background lg:bg-muted">
			<Sidebar />
			<div className="flex min-w-0 flex-1 flex-col gap-4 p-4 pb-24 lg:p-6">
				<Topbar
					userName={userName}
					notificationCount={notificationCount}
					className="hidden lg:flex"
				/>
				<main className="flex-1 lg:rounded-2xl lg:bg-background lg:p-8 lg:shadow-xs">
					{children}
				</main>
			</div>
			<BottomTabBar />
		</div>
	);
}

export { DashboardLayout };
