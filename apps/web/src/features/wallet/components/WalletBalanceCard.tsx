"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { toast } from "@repo/ui/sonner";
import { useWalletBalance } from "@/features/dashboard/hooks";
import { usePendingBalance } from "@/features/wallet/hooks";
import { FundWalletDialog } from "@/features/wallet/components/FundWalletDialog";
import { formatUsdc } from "@/lib/currency";
import { useAuthStore } from "@/lib/stores/authStore";

function WalletBalanceCardSkeleton() {
	return (
		<div className="flex w-full flex-col overflow-hidden rounded-2xl">
			<div className="flex flex-col gap-4 bg-neutral-100 p-6 sm:p-8">
				<Skeleton className="h-4 w-32 bg-neutral-200" />
				<Skeleton className="h-9 w-48 bg-neutral-200" />
				<div className="flex gap-3">
					<Skeleton className="h-11 w-28 bg-neutral-200" />
					<Skeleton className="h-11 w-28 bg-neutral-200" />
				</div>
			</div>
			<div className="flex flex-col gap-4 bg-neutral-100 p-6 sm:p-8">
				<Skeleton className="h-4 w-32 bg-neutral-200" />
				<Skeleton className="h-7 w-40 bg-neutral-200" />
			</div>
		</div>
	);
}

/**
 * The Wallet page's balance display — Available (green) and Pending (gold)
 * as one visually continuous card, per the mock, rather than two separate
 * cards. The dashboard's own `BalanceCard` stays a standalone component
 * (no pending section there), so this composes the same balance query
 * directly instead of trying to force one component to cover both shapes.
 * Shared by both account types — the only difference is the second action
 * button (Send vs. Withdraw), per the merchant Wallet mock.
 */
function WalletBalanceCard() {
	const { data: available } = useWalletBalance();
	const { data: pending } = usePendingBalance();
	const [availableVisible, setAvailableVisible] = useState(true);
	const [pendingVisible, setPendingVisible] = useState(true);
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");

	if (!available || !pending) return <WalletBalanceCardSkeleton />;

	return (
		<div className="flex w-full flex-col overflow-hidden rounded-2xl">
			<div className="flex flex-col gap-6 bg-linear-to-br from-primary-500 to-primary-800 p-6 text-primary-foreground sm:p-8">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-2">
						<span className="text-c1 text-primary-100 sm:text-b3">
							Available Balance
						</span>
						<span className="text-h5 sm:text-h4">
							{availableVisible
								? `${formatUsdc(available.amount)} ${available.currency}`
								: `•••••• ${available.currency}`}
						</span>
					</div>
					<button
						type="button"
						onClick={() => setAvailableVisible((v) => !v)}
						aria-label={
							availableVisible ? "Hide available balance" : "Show available balance"
						}
						className="shrink-0 text-primary-100 transition-colors hover:text-primary-foreground"
					>
						{availableVisible ? (
							<Eye className="size-5" aria-hidden="true" />
						) : (
							<EyeOff className="size-5" aria-hidden="true" />
						)}
					</button>
				</div>

				<div className="flex gap-3">
					<Button
						asChild
						variant="ghost"
						className="bg-background text-foreground hover:bg-neutral-100 lg:hidden"
					>
						<Link href="/wallet/fund">Add Money</Link>
					</Button>
					<FundWalletDialog>
						<Button
							type="button"
							variant="ghost"
							className="hidden bg-background text-foreground hover:bg-neutral-100 lg:inline-flex"
						>
							Add Money
						</Button>
					</FundWalletDialog>
					{isMerchant ? (
						// No withdrawal flow exists yet (no mock for one either) —
						// a real, clickable button that says so beats either a
						// dead link or a visually "broken" disabled primary CTA.
						<Button
							type="button"
							variant="ghost"
							className="bg-background text-foreground hover:bg-neutral-100"
							onClick={() => toast.info("Withdrawals are coming soon")}
						>
							Withdraw
						</Button>
					) : (
						<Button
							asChild
							variant="ghost"
							className="bg-background text-foreground hover:bg-neutral-100"
						>
							<Link href="/send">Send</Link>
						</Button>
					)}
				</div>
			</div>

			<div className="flex items-center justify-between gap-4 bg-linear-to-br from-secondary-400 to-secondary-600 p-6 text-foreground sm:p-8">
				<div className="flex flex-col gap-2">
					<span className="text-c1 sm:text-b3">Pending Balance</span>
					<span className="text-s1 sm:text-h5">
						{pendingVisible
							? `${formatUsdc(pending.amount)} ${pending.currency}`
							: `•••••• ${pending.currency}`}
					</span>
				</div>
				<button
					type="button"
					onClick={() => setPendingVisible((v) => !v)}
					aria-label={pendingVisible ? "Hide pending balance" : "Show pending balance"}
					className="shrink-0 text-foreground/70 transition-colors hover:text-foreground"
				>
					{pendingVisible ? (
						<Eye className="size-5" aria-hidden="true" />
					) : (
						<EyeOff className="size-5" aria-hidden="true" />
					)}
				</button>
			</div>
		</div>
	);
}

export { WalletBalanceCard };
