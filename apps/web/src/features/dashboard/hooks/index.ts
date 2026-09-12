import { useQuery } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import { useMyWallet } from "@/features/wallet/hooks";
import type { ApiSuccessResponse, TransactionData } from "@/lib/api/types";

interface WalletBalanceSummary {
	amount: number;
	currency: string;
	localAmount: number;
	localCurrency: string;
}

function findWalletAmount(
	balances: { currency: string; amount: string }[] | undefined,
	currency: string,
) {
	return Number(balances?.find((b) => b.currency === currency)?.amount ?? 0);
}

/** The account's real, single balance display — reads the wallet's own
 * `balances` (`GET /wallets/stellar`, via `useMyWallet`), the same source
 * `WalletBalanceCard` uses (see that component's own note). Previously this
 * called `GET /transactions/balances` instead — a ledger-derived rollup
 * that can miss funds added outside a recorded transaction (reported live:
 * the individual dashboard's own balance card showed nothing/zero for an
 * account that had genuinely been funded via the testnet faucet). The
 * wallet's own balances are "live from Horizon" for USDC per the backend
 * team, so they're the authoritative number every consumer here actually
 * wants — `BalanceCard`, and the Send/Fund/Pay success + validation steps
 * that all read this same hook.
 *
 * Reshaped into the same "primary + local" `WalletBalanceSummary` shape
 * those consumers already expect, so none of them need to change beyond
 * this. No separate loading branch needed for "no wallet yet" — same as
 * `WalletBalanceCard`, that's a real `0.00`, not an error. */
function useWalletBalance() {
	const { data: wallet, isLoading } = useMyWallet();

	if (isLoading) return { data: undefined, isLoading: true };

	const data: WalletBalanceSummary = {
		amount: findWalletAmount(wallet?.balances, "USDC"),
		currency: "USDC",
		localAmount: findWalletAmount(wallet?.balances, "GHS"),
		localCurrency: "GHS",
	};

	return { data, isLoading: false };
}

/** The dashboard's abbreviated "Recent Transactions" — the same real
 * `GET /transactions` `TransactionHistoryList` uses, just the first page at
 * a small page size and no filters. Scoped server-side by account type
 * already (individual's own personal history vs. a merchant's consolidated
 * feed), so this needs no branching of its own. */
function useRecentTransactions(limit = 4) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: ["dashboard", "recent-transactions", limit],
		queryFn: async (): Promise<TransactionData[]> => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<TransactionData[]>>(
				apiRoutes.transactions.LIST,
				{ params: { page: 1, limit } },
			);
			return data.data;
		},
	});
}

export { useWalletBalance, useRecentTransactions };
export type { WalletBalanceSummary };
