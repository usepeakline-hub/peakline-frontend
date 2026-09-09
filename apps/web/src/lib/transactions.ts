import { ArrowDownLeft, ArrowUpRight, ScanLine } from "lucide-react";
import type { Transaction, TransactionKind } from "@/features/dashboard/hooks";

/** Shared by the dashboard's abbreviated "Recent Transactions" and the full
 * `/transactions` history list — pulled out here once a second consumer of
 * the same row rendering showed up, rather than duplicating it. */
const KIND_STYLES: Record<TransactionKind, { icon: typeof ArrowDownLeft; className: string }> = {
	received: { icon: ArrowDownLeft, className: "bg-primary-600" },
	sent: { icon: ArrowUpRight, className: "bg-destructive" },
	scan_pay: { icon: ScanLine, className: "bg-primary-800" },
};

// Plain muted text per the mock, not the colored StatusBadge pill —
// confirmed by both the desktop and mobile screenshots.
const STATUS_LABEL: Record<Transaction["status"], string> = {
	pending: "Pending",
	processing: "Processing",
	completed: "Completed",
	failed: "Failed",
	cancelled: "Cancelled",
};

function formatTransactionAmount(transaction: Transaction) {
	const sign = transaction.amount > 0 ? "+" : "−";
	const value = Math.abs(transaction.amount).toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	return `${sign}${value} ${transaction.currency}`;
}

// Merchant-only field (see `Transaction.paymentMethod`) — shared by
// `PaymentsTable` and `TransactionDetail` so the two can't label it
// differently.
const PAYMENT_METHOD_LABEL: Record<NonNullable<Transaction["paymentMethod"]>, string> = {
	qr: "QR",
	link: "Link",
};

export { KIND_STYLES, STATUS_LABEL, PAYMENT_METHOD_LABEL, formatTransactionAmount };
