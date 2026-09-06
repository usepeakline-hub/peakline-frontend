"use client";

import { Bell } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { UserAvatar } from "@/features/dashboard/components/UserAvatar";

interface TopbarProps {
	userName: string;
	notificationCount?: number;
	className?: string;
}

/**
 * Desktop-only top bar (the mock has no equivalent on mobile — there, the
 * account avatar moves into the greeting row instead and the bell is
 * dropped entirely, see `GreetingHeader`). The empty space on the left is
 * deliberately open for a future page title or search field.
 */
function Topbar({ userName, notificationCount = 0, className }: TopbarProps) {
	return (
		<header
			className={cn(
				"items-center justify-end gap-4 rounded-2xl bg-background px-4 py-4 shadow-xs sm:px-6",
				className,
			)}
		>
			<button
				type="button"
				aria-label={
					notificationCount > 0
						? `${notificationCount} unread notifications`
						: "Notifications"
				}
				className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
			>
				<Bell className="size-4.5" aria-hidden="true" />
				{notificationCount > 0 && (
					<span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-primary-500 text-c3 text-primary-foreground">
						{notificationCount > 99 ? "99+" : notificationCount}
					</span>
				)}
			</button>

			<div className="flex items-center gap-2.5">
				<UserAvatar name={userName} />
				<span className="text-b2 text-foreground">{userName}</span>
			</div>
		</header>
	);
}

export { Topbar };
