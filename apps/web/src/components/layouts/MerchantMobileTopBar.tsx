"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Store, ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { MerchantMobileNav } from "@/components/layouts/MerchantMobileNav";
import { MERCHANT_NAV_ITEMS } from "@/components/layouts/MerchantNavList";

/** The current nav item's label, for an *exact* match only — deliberately
 * not the prefix match `MerchantNavList` uses for its own highlighting
 * (`/transactions/123` still highlighting "Transactions" there is fine;
 * this bar showing "Payments" over `/payments/[id]` would double up with
 * that page's own back+title header, which already exists and already
 * knows to go back to the list rather than to Overview). Nested routes
 * with no exact nav entry of their own keep the plain Merchant-badge bar
 * and rely on their own page-level header instead, same as today. */
function currentPageTitle(pathname: string) {
	if (pathname === "/") return null;
	const match = MERCHANT_NAV_ITEMS.find((item) => item.href && pathname === item.href);
	return match?.label ?? null;
}

/**
 * Merchant-only mobile header row. On Overview this is the "Merchant" badge
 * (same styling as `Topbar`'s desktop one) paired with a hamburger button
 * that opens `MerchantMobileNav`. On every other top-level nav destination
 * (Wallet, Payments, Payment Links, ...) it instead shows a back arrow
 * (to Overview) + the page's own title, centered, still paired with the
 * same hamburger — one combined bar rather than stacking this on top of
 * each page's own title heading, per the updated Payments mock. Individual
 * has no equivalent (mobile stays a flat page with no topbar there, per
 * `DashboardLayout`'s own note) — this renders nothing for that account
 * type, self-branching the same way `Sidebar`/`BottomTabBar` already do, so
 * `DashboardLayout` doesn't need to know or care which account type is
 * active.
 */
function MerchantMobileTopBar() {
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");
	const pathname = usePathname();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	if (!isMerchant) return null;

	const title = currentPageTitle(pathname);

	return (
		<div className="flex items-center justify-between lg:hidden">
			{title ? (
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

			{title && <h1 className="text-s1 text-foreground">{title}</h1>}

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
