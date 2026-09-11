"use client";

import { TrendingUp } from "lucide-react";
import { Skeleton } from "@repo/ui/skeleton";
import { useMerchantOverview } from "@/features/merchant/hooks";
import { formatUsdc } from "@/lib/currency";

function StatCardSkeleton() {
	return (
		<div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 sm:p-6">
			<Skeleton className="h-4 w-28" />
			<Skeleton className="h-8 w-32" />
			<Skeleton className="h-4 w-24" />
		</div>
	);
}

function ChangeIndicator({ pct, label }: { pct: number | null; label: string }) {
	// `changePct` is null when the comparison baseline was 0 (the real
	// endpoint's own documented behavior) — nothing meaningful to show a
	// percent change against, so this renders neither the icon nor a
	// misleading 0%/blank number.
	if (pct === null) {
		return <span className="text-c1 text-muted-foreground">{label}</span>;
	}
	return (
		<span className="flex items-center gap-1 text-c1 text-success">
			<TrendingUp className="size-3.5" aria-hidden="true" />
			{pct}% {label}
		</span>
	);
}

/**
 * Merchant Overview's three headline numbers — analytics-flavored, unlike
 * the individual dashboard's single `BalanceCard`. The mock shows these
 * with a "$" prefix; kept to the app's own "amount USDC" convention instead
 * (see `formatUsdc`/`BalanceCard`) rather than introducing a one-off
 * dollar-sign format nowhere else in the app uses. Real as of
 * `GET /merchant/dashboard/stats` — the comparison label under each of the
 * first two now reflects what that stat is actually compared against
 * ("vs previous month" / "vs yesterday") instead of both hardcoding
 * "this month".
 */
function MerchantStatsCards() {
	const { data } = useMerchantOverview();

	if (!data) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<StatCardSkeleton />
				<StatCardSkeleton />
				<StatCardSkeleton />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-5 sm:p-6">
				<span className="text-b3 text-muted-foreground">Total Received</span>
				<span className="text-h4 text-foreground">
					{formatUsdc(data.totalReceived)} {data.currency}
				</span>
				<ChangeIndicator pct={data.totalReceivedChangePct} label={data.totalReceivedChangeLabel} />
			</div>

			<div className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-5 sm:p-6">
				<span className="text-b3 text-muted-foreground">Today&apos;s Payments</span>
				<span className="text-h4 text-foreground">
					{formatUsdc(data.todaysPayments)} {data.currency}
				</span>
				<ChangeIndicator pct={data.todaysPaymentsChangePct} label={data.todaysPaymentsChangeLabel} />
			</div>

			<div className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-5 sm:p-6">
				<span className="text-b3 text-muted-foreground">Pending</span>
				<span className="text-h4 text-destructive">
					{formatUsdc(data.pending)} {data.currency}
				</span>
				<span className="text-c1 text-muted-foreground">
					{data.pendingCount} Transaction{data.pendingCount === 1 ? "" : "s"}
				</span>
			</div>
		</div>
	);
}

export { MerchantStatsCards };
