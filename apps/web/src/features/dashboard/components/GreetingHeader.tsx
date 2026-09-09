"use client";

import { Bell } from "lucide-react";
import { Skeleton } from "@repo/ui/skeleton";
import { useGreeting } from "@/features/dashboard/hooks";
import { UserAvatar } from "@/features/dashboard/components/UserAvatar";
import { useAuthStore } from "@/lib/stores/authStore";
import { useAccountDisplayName } from "@/features/merchant/hooks";

interface GreetingHeaderProps {
	/** TODO: source from the authenticated session once one exists. */
	userName?: string;
}

// TODO: source from a real notifications feed once one exists — same fake
// default `Topbar` uses for its own (desktop) bell.
const NOTIFICATION_COUNT = 10;

function timeOfDayGreeting(hour: number) {
	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
}

/**
 * On mobile the account avatar lives here, inline with the greeting —
 * there's no separate topbar there for individual (see `Topbar`,
 * desktop-only). At `lg` and up this avatar is hidden since Topbar already
 * shows one. Merchant additionally gets a notification bell next to it on
 * mobile too, per the updated mock — individual has no bell there at all
 * (no mock has ever shown one), so it's merchant-only here.
 */
function GreetingHeader({ userName = "John Doe" }: GreetingHeaderProps) {
	const { data } = useGreeting();
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");
	const avatarName = useAccountDisplayName(userName);

	if (!data) {
		return (
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-7 w-48 sm:h-8 sm:w-56" />
					<Skeleton className="h-4 w-64 max-w-full sm:h-5 sm:w-72" />
				</div>
				<Skeleton className="size-9 shrink-0 rounded-full lg:hidden" />
			</div>
		);
	}

	return (
		<div className="flex items-start justify-between gap-4">
			<div className="flex flex-col gap-2">
				<h1 className="text-h5 text-foreground sm:text-h4">
					{timeOfDayGreeting(new Date().getHours())}, {data.firstName}
				</h1>
				<p className="text-b3 text-muted-foreground sm:text-b1">
					<span className="lg:hidden">Here&apos;s what&apos;s happening today.</span>
					<span className="hidden lg:inline">
						Here&apos;s what&apos;s happening with your{" "}
						{isMerchant ? "account" : "wallet"} today.
					</span>
				</p>
			</div>
			<div className="flex shrink-0 items-center gap-3 lg:hidden">
				{isMerchant && (
					<button
						type="button"
						aria-label={
							NOTIFICATION_COUNT > 0
								? `${NOTIFICATION_COUNT} unread notifications`
								: "Notifications"
						}
						className="relative flex aspect-square size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
					>
						<Bell className="size-4.5" aria-hidden="true" />
						{NOTIFICATION_COUNT > 0 && (
							<span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary-500 text-c3 text-primary-foreground">
								{NOTIFICATION_COUNT > 99 ? "99+" : NOTIFICATION_COUNT}
							</span>
						)}
					</button>
				)}
				<UserAvatar name={avatarName} />
			</div>
		</div>
	);
}

export { GreetingHeader };
