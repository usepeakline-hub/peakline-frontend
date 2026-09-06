"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, ScanLine, ArrowLeftRight, User } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

const TABS = [
	{ label: "Home", href: "/", icon: Home, elevated: false },
	{ label: "Wallet", href: "/wallet", icon: Wallet, elevated: false },
	{ label: "Pay", href: "/pay", icon: ScanLine, elevated: true },
	{
		label: "Transactions",
		href: "/transactions",
		icon: ArrowLeftRight,
		elevated: false,
	},
	{ label: "Profile", href: "/profile", icon: User, elevated: false },
] as const;

function isActive(pathname: string, href: string) {
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Mobile-only primary nav (hidden at `lg` and up, where `Sidebar` takes
 * over) — a curated 5 destinations rather than the sidebar's full 9, with
 * "Pay" as an elevated center scan/pay action, per the mobile mock. The
 * other sidebar items (Send, Receive, Request Payment, Settings) are
 * reachable from the dashboard's own Quick Actions instead of living here.
 *
 * Each tab is an equal-width `flex-1` column, not `justify-around` — with
 * that, "Transactions" (the longest label) claims more than its fair share
 * of intrinsic width and skews every gap around it, so the elevated Pay
 * button (the visual anchor of the whole bar) ends up off the bar's actual
 * center. Equal columns keep the center slot centered regardless of how
 * long any one label is.
 */
function BottomTabBar() {
	const pathname = usePathname();

	return (
		<nav className="fixed inset-x-0 bottom-0 z-40 flex items-end rounded-t-2xl bg-background pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:hidden">
			{TABS.map(({ label, href, icon: Icon, elevated }) => {
				const active = isActive(pathname, href);

				if (elevated) {
					return (
						<Link
							key={href}
							href={href}
							aria-current={active ? "page" : undefined}
							aria-label={label}
							className="-mt-6 flex flex-1 items-center justify-center"
						>
							<span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-500 text-primary-foreground shadow-md transition-colors">
								<Icon className="size-6" aria-hidden="true" />
							</span>
						</Link>
					);
				}

				return (
					<Link
						key={href}
						href={href}
						aria-current={active ? "page" : undefined}
						className={cn(
							"flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-center text-c2",
							active ? "text-primary-600" : "text-muted-foreground",
						)}
					>
						<Icon className="size-5" aria-hidden="true" />
						{label}
					</Link>
				);
			})}
		</nav>
	);
}

export { BottomTabBar };
