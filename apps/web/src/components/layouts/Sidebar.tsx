"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutGrid,
	Wallet,
	Send,
	ArrowDownLeft,
	ScanLine,
	HandCoins,
	ArrowLeftRight,
	User,
	Settings,
	LogOut,
} from "lucide-react";
import { Logo } from "@repo/ui/logo";
import { cn } from "@repo/ui/lib/utils";
import { useLogout } from "@/features/auth/hooks";

const NAV_ITEMS = [
	{ label: "Dashboard", href: "/", icon: LayoutGrid },
	{ label: "Wallet", href: "/wallet", icon: Wallet },
	{ label: "Send", href: "/send", icon: Send },
	{ label: "Receive", href: "/receive", icon: ArrowDownLeft },
	{ label: "Pay", href: "/pay", icon: ScanLine },
	{ label: "Request Payment", href: "/request-payment", icon: HandCoins },
	{ label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
	{ label: "Profile", href: "/profile", icon: User },
	{ label: "Settings", href: "/settings", icon: Settings },
] as const;

/** True for the item's own route, and (except the root Dashboard item) any
 * route nested under it — so e.g. /transactions/123 still highlights
 * "Transactions". */
function isActive(pathname: string, href: string) {
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Desktop-only primary nav — below `lg` this is replaced entirely by
 * `BottomTabBar`, not collapsed into a drawer, per the mobile mock.
 *
 * `fixed`, not `sticky`, and deliberately so: a Radix Dialog (Fund Wallet)
 * locks scroll by setting `overflow: hidden` on `<body>`, which makes body
 * a new scroll container sitting between `html` (the page's real scrolling
 * element) and this sidebar — that breaks a `sticky` sidebar's positioning
 * math entirely, so opening the modal while scrolled down made it jump to
 * track the scroll offset instead of staying pinned. `fixed` anchors to the
 * viewport directly and doesn't care what any ancestor's overflow is.
 * `DashboardLayout` reserves this width on the content column with
 * `lg:ml-65` since a fixed element no longer occupies flex layout space.
 */
function Sidebar() {
	const pathname = usePathname();
	const logout = useLogout();

	return (
		<aside className="fixed inset-y-0 left-0 z-30 hidden h-screen w-65 shrink-0 flex-col gap-8 border-r border-border bg-background px-4 py-6 lg:flex">
			<Logo size="lg" className="px-2" />

			<nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
				{NAV_ITEMS.map(({ label, href, icon: Icon }) => {
					const active = isActive(pathname, href);
					return (
						<Link
							key={href}
							href={href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2.5 text-b3 font-medium transition-colors",
								active
									? "bg-primary-500 text-primary-foreground"
									: "text-foreground hover:bg-muted",
							)}
						>
							<Icon className="size-4.5 shrink-0" aria-hidden="true" />
							{label}
						</Link>
					);
				})}
			</nav>

			<button
				type="button"
				onClick={logout}
				className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-b3 font-medium text-destructive transition-colors hover:bg-danger-100"
			>
				<LogOut className="size-4.5 shrink-0" aria-hidden="true" />
				Logout
			</button>
		</aside>
	);
}

export { Sidebar };
