import { Construction } from "lucide-react";
import { EmptyState } from "@repo/ui/empty-state";

/** Placeholder for every nav destination not built yet — see the phased
 * build plan (Phase 1: Users/Businesses/Transactions/Audit Log read-only;
 * Phase 2: user/business actions; Phase 3: Wallets/Ledger ops; Phase 4:
 * Payment Links/Config/Staff). Keeps the full nav click-through-able from
 * Phase 0 on, rather than 404ing or hiding items that just aren't wired
 * yet. */
function ComingSoonPage({ title, phase }: { title: string; phase: string }) {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-h4 text-foreground">{title}</h1>
			</div>
			<div className="rounded-2xl border border-border bg-background">
				<EmptyState
					icon={Construction}
					title="Coming soon"
					description={`${title} management is planned for ${phase} — not built yet.`}
				/>
			</div>
		</div>
	);
}

export { ComingSoonPage };
