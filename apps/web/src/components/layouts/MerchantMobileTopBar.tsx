"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Store, ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { MerchantMobileNav } from "@/components/layouts/MerchantMobileNav";
import { MERCHANT_NAV_ITEMS } from "@/components/layouts/MerchantNavList";

/** The nav item whose `href` exactly matches this route — excluding
 * Overview's own `href: "/"`, which needs the plain Merchant badge instead
 * of a "back to Overview" bar pointing at itself. `null` means either
 * Overview or a nested/detail route with no exact nav entry; the caller
 * tells those two apart via `pathname === "/"` separately. */
function matchTopLevelItem(pathname: string) {
	return (
		MERCHANT_NAV_ITEMS.find((item) => item.href && item.href !== "/" && pathname === item.href) ?? null
	);
}

/**
 * Merchant-only mobile header row — three states depending on the route:
 *
 * - **Overview** (`/`): the "Merchant" badge + hamburger, same as ever —
 *   this is the account's home, nothing to go "back" to.
 * - **Any other top-level nav destination** (Wallet, Payments, Payment
 *   Links, My QR Code, Transactions, Account): a back arrow (to Overview)
 *   + that page's own title, centered, still paired with the hamburger —
 *   one combined bar, per the Payments mock.
 * - **Everything else** (a nested/detail route with no exact nav entry of
 *   its own — `/payments/[id]`, `/payment-links/create`, ...): just the
 *   hamburger, right-aligned, nothing on the left. These pages already
 *   render their own back+title header as part of the page body (e.g.
 *   `MobileStepHeader`'s "‹ Payments"); stacking the generic "Merchant"
 *   badge on top of that read as two headers for one screen — this drops
 *   the redundant one and keeps just enough chrome to still reach the nav
 *   drawer from anywhere.
 *
 * Individual has no equivalent (mobile stays a flat page with no topbar
 * there, per `DashboardLayout`'s own note) — this renders nothing for that
 * account type, self-branching the same way `Sidebar`/`BottomTabBar`
 * already do, so `DashboardLayout` doesn't need to know or care which
 * account type is active.
 */
function MerchantMobileTopBar() {
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");
	const pathname = usePathname();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	if (!isMerchant) return null;

	const isOverview = pathname === "/";
	const match = matchTopLevelItem(pathname);

	if (!isOverview && !match) {
		return (
			<div className="flex justify-end lg:hidden">
				<button
					type="button"
					onClick={() => setOpen(true)}
					aria-label="Open menu"
					className="flex aspect-square size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
				>
					<Menu className="size-5" aria-hidden="true" />
				</button>

				<MerchantMobileNav open={open} onOpenChange={setOpen} />
			</div>
		);
	}

	return (
		<div className="flex items-center justify-between lg:hidden">
			{match ? (
				<button
					type="button"
					onClick={() => router.push("/")}
					aria-label="Back to Overview"
					className="flex aspect-square size-10 items-center justify-center text-foreground"
				>
					<ChevronLeft className="size-5" aria-hidden="true" />
				</button>
			) : (
				<span className="flex items-center gap-2 rounded-lg bg-primary-500/10 px-3 py-2 text-b3 font-medium text-primary-700">
					<Store className="size-4" aria-hidden="true" />
					Merchant
				</span>
			)}

			{match && <h1 className="text-s1 text-foreground">{match.label}</h1>}

			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label="Open menu"
				className="flex aspect-square size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
			>
				<Menu className="size-5" aria-hidden="true" />
			</button>

			<MerchantMobileNav open={open} onOpenChange={setOpen} />
		</div>
	);
}

export { MerchantMobileTopBar };
