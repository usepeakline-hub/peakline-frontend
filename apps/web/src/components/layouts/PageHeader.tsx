/**
 * Desktop-only H1 + subtitle header for primary content pages (Receive,
 * Transactions, Profile) — mobile uses `MobileStepHeader`'s back-arrow +
 * centered-title treatment instead, per the mocks (both render side by
 * side in a page, each hiding itself at the other breakpoint via Tailwind,
 * same trick as `WalletBalanceCard`'s dual Add-Money buttons). The two
 * don't share one component since their shapes genuinely differ — a
 * subtitle vs. an optional back arrow — not just their breakpoint.
 */
function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<div className="hidden flex-col gap-1 lg:flex">
			<h1 className="text-h4 text-foreground">{title}</h1>
			<p className="text-b3 text-muted-foreground">{subtitle}</p>
		</div>
	);
}

export { PageHeader };
