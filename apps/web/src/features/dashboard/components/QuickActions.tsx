"use client";

import Link from "next/link";
import { Send, ArrowDownLeft, ScanLine, HandCoins } from "lucide-react";
import { Skeleton } from "@repo/ui/skeleton";
import { useQuickActionsReady } from "@/features/dashboard/hooks";

const ACTIONS = [
	{ label: "Send", href: "/send", icon: Send },
	{ label: "Receive", href: "/receive", icon: ArrowDownLeft },
	{ label: "Pay", href: "/pay", icon: ScanLine },
	{ label: "Request", href: "/request-payment", icon: HandCoins },
] as const;

function QuickActionsSkeleton() {
	return (
		<div className="grid grid-cols-4 gap-2 sm:gap-4">
			{ACTIONS.map((action) => (
				<Skeleton key={action.label} className="h-24 w-full rounded-xl sm:h-28" />
			))}
		</div>
	);
}

/** Stays a single row of 4 at every width, per the mock (mobile just
 * shrinks padding/icon size rather than wrapping to a 2x2 grid). */
function QuickActions() {
	const { isPending } = useQuickActionsReady();

	if (isPending) return <QuickActionsSkeleton />;

	return (
		<div className="grid grid-cols-4 gap-2 sm:gap-4">
			{ACTIONS.map(({ label, href, icon: Icon }) => (
				<Link
					key={label}
					href={href}
					className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-3 text-center transition-colors hover:bg-muted sm:gap-3 sm:p-5"
				>
					<span className="flex size-8 items-center justify-center rounded-full bg-primary-500/10 sm:size-10">
						<Icon className="size-4 text-primary-600 sm:size-5" aria-hidden="true" />
					</span>
					<span className="text-c2 text-foreground sm:text-b2">{label}</span>
				</Link>
			))}
		</div>
	);
}

export { QuickActions };
