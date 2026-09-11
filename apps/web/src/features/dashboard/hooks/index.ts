import { useQuery } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import { usdcToGhs } from "@/lib/currency";
import type { ApiSuccessResponse, BalanceData, TransactionData } from "@/lib/api/types";

// TODO: replace with real calls into the wallet/ledger API once it exists.
// Each section fetches independently (and on its own fake delay) so the
// skeletons genuinely demonstrate sections loading at different times,
// the way real, separately-fetched widgets would.
async function fakeRequest<T>(payload: T, delay = 900): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, delay));
	return payload;
}

interface GreetingData {
	firstName: string;
}

function useGreeting() {
	return useQuery({
		queryKey: ["dashboard", "greeting"],
		queryFn: () => fakeRequest<GreetingData>({ firstName: "Kwame" }, 500),
	});
}

interface WalletBalanceSummary {
	amount: number;
	currency: string;
	localAmount: number;
	localCurrency: string;
}

/** Real as of `GET /transactions/balances` — an array with one entry per
 * currency the account has ever held, not a fixed USDC+GHS pair. Reshaped
 * into the single-object "primary + local estimate" shape every consumer
 * (`BalanceCard`, `WalletBalanceCard`, Send/Fund/Pay's own success steps)
 * already expects, so none of them need to change. A GHS entry not being
 * present yet (an account that's never held any) falls back to the same
 * fixed-rate `usdcToGhs` estimate the rest of the app already shows
 * elsewhere (transaction/payment detail's own "~ GHS" line) rather than
 * showing nothing. */
function useWalletBalance() {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: ["dashboard", "balance"],
		queryFn: async (): Promise<WalletBalanceSummary> => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<BalanceData[]>>(
				apiRoutes.transactions.BALANCES,
			);
			const balances = data.data;
			const usdc = balances.find((b) => b.currency === "USDC");
			const ghs = balances.find((b) => b.currency === "GHS");
			const amount = usdc ? Number(usdc.balance) : 0;

			return {
				amount,
				currency: "USDC",
				localAmount: ghs ? Number(ghs.balance) : usdcToGhs(amount),
				localCurrency: "GHS",
			};
		},
	});
}

/** Static today, but fetched like the rest — quick actions are the kind of
 * thing a backend would eventually personalize/reorder per account. */
function useQuickActionsReady() {
	return useQuery({
		queryKey: ["dashboard", "quick-actions"],
		queryFn: () => fakeRequest(true, 650),
	});
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

export {
	useGreeting,
	useWalletBalance,
	useQuickActionsReady,
	useRecentTransactions,
};
export type { GreetingData, WalletBalanceSummary };
