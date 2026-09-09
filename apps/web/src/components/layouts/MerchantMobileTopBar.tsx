"use client";

import { useState } from "react";
import { Menu, Store } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { MerchantMobileNav } from "@/components/layouts/MerchantMobileNav";

/**
 * Merchant-only mobile header row — the "Merchant" badge (same styling as
 * `Topbar`'s desktop one) paired with a hamburger button that opens
 * `MerchantMobileNav`. Individual has no equivalent (mobile stays a flat
 * page with no topbar there, per `DashboardLayout`'s own note) — this
 * renders nothing for that account type, self-branching the same way
 * `Sidebar`/`BottomTabBar` already do, so `DashboardLayout` doesn't need to
 * know or care which account type is active.
 */
function MerchantMobileTopBar() {
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");
	const [open, setOpen] = useState(false);

	if (!isMerchant) return null;

	return (
		<div className="flex items-center justify-between lg:hidden">
			<span className="flex items-center gap-2 rounded-lg bg-primary-500/10 px-3 py-2 text-b3 font-medium text-primary-700">
				<Store className="size-4" aria-hidden="true" />
				Merchant
			</span>
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
