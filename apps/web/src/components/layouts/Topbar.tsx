"use client";

import { Bell, Store } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { UserAvatar } from "@/features/dashboard/components/UserAvatar";
import { useAuthStore } from "@/lib/stores/authStore";
import { useAccountDisplayName } from "@/features/merchant/hooks";

interface TopbarProps {
	userName: string;
	notificationCount?: number;
	className?: string;
}

/**
 * Desktop-only top bar (the mock has no equivalent on mobile — there, the
 * account avatar moves into the greeting row instead and the bell is
 * dropped entirely, see `GreetingHeader`). The left side is a page
 * title/search field for an individual account, per the original note here
 * — turns out to be exactly where the first merchant mock put its
 * "Merchant" badge instead, so that's what fills it once `customerType` is
 * merchant.
 */
function Topbar({ userName, notificationCount = 0, className }: TopbarProps) {
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");
	const displayName = useAccountDisplayName(userName);

	return (
		<header
			className={cn(
				"items-center justify-between gap-4 rounded-2xl bg-background px-4 py-4 shadow-xs sm:px-6",
				!isMerchant && "justify-end",
				className,
			)}
		>
			{isMerchant && (
				<span className="flex items-center gap-2 rounded-lg bg-primary-500/10 px-3 py-2 text-b3 font-medium text-primary-700">
					<Store className="size-4" aria-hidden="true" />
					Merchant
				</span>
			)}

			<div className="flex items-center gap-4">
				<button
					type="button"
					aria-label={
						notificationCount > 0
							? `${notificationCount} unread notifications`
							: "Notifications"
					}
					className="relative flex aspect-square size-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
				>
					<Bell className="size-4.5" aria-hidden="true" />
					{notificationCount > 0 && (
						<span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-primary-500 text-c3 text-primary-foreground">
							{notificationCount > 99 ? "99+" : notificationCount}
						</span>
					)}
				</button>

				<div className="flex items-center gap-2.5">
					<UserAvatar name={displayName} />
					<span className="text-b2 text-foreground">{displayName}</span>
				</div>
			</div>
		</header>
	);
}

export { Topbar };
