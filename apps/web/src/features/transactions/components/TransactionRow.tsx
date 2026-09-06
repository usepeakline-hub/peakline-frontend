import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { KIND_STYLES, STATUS_LABEL, formatTransactionAmount } from "@/lib/transactions";
import type { Transaction } from "@/features/dashboard/hooks";

/** One row, shared by the dashboard's abbreviated list and the full
 * `/transactions` history — see `@/lib/transactions` for why this was
 * pulled out. Links to the transaction's own detail/receipt page, wherever
 * it's rendered. */
function TransactionRow({ transaction }: { transaction: Transaction }) {
	const { icon: Icon, className } = KIND_STYLES[transaction.kind];

	return (
		<Link
			href={`/transactions/${transaction.id}`}
			className="flex items-center gap-4 border-b border-border py-4 transition-colors last:border-0 hover:bg-muted">
			<span
				className={cn(
					"flex size-9 shrink-0 items-center justify-center rounded-full text-primary-foreground sm:size-11",
					className,
				)}
			>
				<Icon className="size-4 sm:size-5" aria-hidden="true" />
			</span>
			<div className="flex flex-1 flex-col gap-0.5">
				<span className="text-b4 text-foreground sm:text-b2">{transaction.title}</span>
				<span className="text-c1 text-muted-foreground">{transaction.timestamp}</span>
			</div>
			<div className="flex flex-col items-end gap-1">
				<span
					className={cn(
						"text-b4 font-semibold sm:text-b2",
						transaction.amount > 0 ? "text-success" : "text-destructive",
					)}
				>
					{formatTransactionAmount(transaction)}
				</span>
				<span className="text-c1 text-muted-foreground">
					{STATUS_LABEL[transaction.status]}
				</span>
			</div>
		</Link>
	);
}

export { TransactionRow };
