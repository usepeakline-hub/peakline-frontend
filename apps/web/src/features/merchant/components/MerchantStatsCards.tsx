"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
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
	// Real data includes negative `changePct` (a genuine drop, e.g.
	// today's payments down 58.6% vs yesterday) — this used to always
	// render an up arrow in success green regardless of sign, which lied
	// about a decrease. Down now gets a down arrow in destructive red.
	const isDown = pct < 0;
	const Icon = isDown ? TrendingDown : TrendingUp;
	return (
		<span className={cn("flex items-center gap-1 text-c1", isDown ? "text-destructive" : "text-success")}>
			<Icon className="size-3.5" aria-hidden="true" />
			{Math.abs(pct)}% {label}
		</span>
	);
}

function StatCard({
	label,
	amount,
	currency,
	pct,
	changeLabel,
}: {
	label: string;
	amount: number;
	currency: string;
	pct: number | null;
	changeLabel: string;
}) {
	return (
		<div className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-5 sm:p-6">
			<span className="text-b3 text-muted-foreground">{label}</span>
			<span className="text-h4 text-foreground">
				{formatUsdc(amount)} {currency}
			</span>
			<ChangeIndicator pct={pct} label={changeLabel} />
		</div>
	);
}

/**
 * Merchant Overview's headline numbers — analytics-flavored, unlike the
 * individual dashboard's single `BalanceCard`. The mock shows these with a
 * "$" prefix; kept to the app's own "amount USDC" convention instead (see
 * `formatUsdc`/`BalanceCard`) rather than introducing a one-off dollar-sign
 * format nowhere else in the app uses. Real as of `GET /merchant/dashboard/stats`
 * — the comparison label under each stat reflects what it's actually
 * compared against ("vs previous month" / "vs yesterday").
 *
 * Five cards, not three — `totalSent`/`todaySent` (real as of 2026-09-13)
 * mean a merchant's money-out is now as visible as its money-in, paired up
 * (Total Received/Total Sent, Today's Payments/Today's Sent) so the two
 * directions read side by side; Pending stays last, its own thing (a count
 * of transactions still in flight, not a received/sent split).
 */
function MerchantStatsCards() {
	const { data } = useMerchantOverview();

	if (!data) {
		return (
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
				<StatCardSkeleton />
				<StatCardSkeleton />
				<StatCardSkeleton />
				<StatCardSkeleton />
				<StatCardSkeleton />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
			<StatCard
				label="Total Received"
				amount={data.totalReceived}
				currency={data.currency}
				pct={data.totalReceivedChangePct}
				changeLabel={data.totalReceivedChangeLabel}
			/>
			<StatCard
				label="Total Sent"
				amount={data.totalSent}
				currency={data.currency}
				pct={data.totalSentChangePct}
				changeLabel={data.totalSentChangeLabel}
			/>
			<StatCard
				label="Today's Payments"
				amount={data.todaysPayments}
				currency={data.currency}
				pct={data.todaysPaymentsChangePct}
				changeLabel={data.todaysPaymentsChangeLabel}
			/>
			<StatCard
				label="Today's Sent"
				amount={data.todaySent}
				currency={data.currency}
				pct={data.todaySentChangePct}
				changeLabel={data.todaySentChangeLabel}
			/>

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
