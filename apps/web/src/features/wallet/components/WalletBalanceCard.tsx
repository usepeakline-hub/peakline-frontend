"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { useMyWallet } from "@/features/wallet/hooks";
import { FundWalletDialog } from "@/features/wallet/components/FundWalletDialog";
import { formatUsdc } from "@/lib/currency";
import { useAuthStore } from "@/lib/stores/authStore";
import type { WalletBalanceItemData } from "@/lib/api/types";

/** Reads one currency's amount straight off the wallet's own `balances`
 * array (see `StellarWalletData`'s doc comment) — `"0.00"` when the array
 * doesn't carry that currency at all (a brand-new wallet, or one that's
 * never held GHS), not a guess. */
function walletAmount(balances: WalletBalanceItemData[] | undefined, currency: string) {
	return Number(balances?.find((b) => b.currency === currency)?.amount ?? 0);
}

function WalletBalanceCardSkeleton() {
	return (
		<div className="flex flex-col gap-4 rounded-2xl bg-neutral-100 p-6 sm:p-8">
			<Skeleton className="h-4 w-32 bg-neutral-200" />
			<Skeleton className="h-9 w-48 bg-neutral-200" />
			<div className="flex gap-3">
				<Skeleton className="h-11 w-28 bg-neutral-200" />
				<Skeleton className="h-11 w-28 bg-neutral-200" />
			</div>
		</div>
	);
}

/**
 * The Wallet page's balance display — sourced from the wallet's own
 * `balances` array (`GET /wallets/stellar`, via `useMyWallet`) rather than
 * `useWalletBalance` (`GET /transactions/balances`, the dashboard's own
 * balance source — see that hook and `StellarWalletData`'s doc comment for
 * why the two are kept deliberately separate). This card is specifically
 * about *the wallet* — every other card on this page (`WalletAddressCard`,
 * the QR code) already reads `useMyWallet` too, so this reuses that same
 * fetch instead of a second request, and both USDC and GHS come back as
 * real balances on the wallet itself, not an FX-converted estimate.
 *
 * The mock's own second "Pending Balance" section was fake data with no
 * real endpoint behind it and the user asked for it gone rather than left
 * showing a number that could never be true. Shared by both account
 * types — individual gets a second "Send" action; merchant gets "Add
 * Money" alone (its own former "Withdraw" button removed for now — no real
 * withdrawal flow exists yet).
 */
function WalletBalanceCard() {
	const { data: wallet, isLoading } = useMyWallet();
	const [availableVisible, setAvailableVisible] = useState(true);
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");

	if (isLoading) return <WalletBalanceCardSkeleton />;

	const usdc = walletAmount(wallet?.balances, "USDC");
	const ghs = walletAmount(wallet?.balances, "GHS");

	return (
		<div className="flex w-full flex-col gap-6 rounded-2xl bg-linear-to-br from-primary-500 to-primary-800 p-6 text-primary-foreground sm:p-8">
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-2">
					<span className="text-c1 text-primary-100 sm:text-b3">
						Available Balance
					</span>
					<span className="text-h5 sm:text-h4">
						{availableVisible ? `${formatUsdc(usdc)} USDC` : "•••••• USDC"}
					</span>
					<span className="text-c1 text-primary-100 sm:text-b3">
						{availableVisible ? `~ GHS ${formatUsdc(ghs)}` : "~ GHS ••••••"}
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
				{!isMerchant && (
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
	);
}

export { WalletBalanceCard };
