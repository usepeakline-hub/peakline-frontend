import { useQuery } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import { usdcToGhs } from "@/lib/currency";
import type { ApiSuccessResponse, BalanceData } from "@/lib/api/types";

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

type TransactionKind = "received" | "sent" | "scan_pay";

interface Transaction {
	id: string;
	kind: TransactionKind;
	title: string;
	timestamp: string;
	amount: number;
	currency: string;
	status: "pending" | "processing" | "completed" | "failed" | "cancelled";
	/** Detail-page-only fields — the abbreviated dashboard list never shows
	 * these, but every entry still carries them so a row can link straight
	 * to `/transactions/[id]` from anywhere. `counterparty*` is omitted for
	 * `scan_pay` (paying a merchant terminal isn't "to" a person). */
	date: string;
	txId: string;
	counterpartyName?: string;
	counterpartyPhone?: string;
	/** How the customer paid — merchant-only (`useMerchantPayments`'s
	 * entries are always `kind: "received"`); absent everywhere else. */
	paymentMethod?: "qr" | "link";
	/** ISO date, for real date-range filtering — merchant-only, same reason
	 * as `paymentMethod`. `date`/`timestamp` above stay display strings for
	 * everyone else since nothing else needs to compare them. */
	isoDate?: string;
}

function useRecentTransactions() {
	return useQuery({
		queryKey: ["dashboard", "recent-transactions"],
		queryFn: () =>
			fakeRequest<Transaction[]>(
				[
					{
						id: "1",
						kind: "received",
						title: "Received from John Doe",
						timestamp: "Today, 10:26 AM",
						date: "6 September, 2026",
						txId: "BJFWHUF9824BPFNJEUH8PI98EBOQ",
						amount: 1000,
						currency: "USDC",
						status: "completed",
						counterpartyName: "John Doe",
						counterpartyPhone: "+233 24 123 4567",
					},
					{
						id: "2",
						kind: "sent",
						title: "Payment to John Doe",
						timestamp: "Today, 10:26 AM",
						date: "6 September, 2026",
						txId: "GKTMNQP4471XZWDCVA6RS3JLYHFE",
						amount: -500,
						currency: "USDC",
						status: "completed",
						counterpartyName: "John Doe",
						counterpartyPhone: "+233 24 123 4567",
					},
					{
						id: "3",
						kind: "received",
						title: "Received from John Doe",
						timestamp: "Today, 10:26 AM",
						date: "6 September, 2026",
						txId: "TVXBHE2358OQKASD9FGH1MNZLPWC",
						amount: 1000,
						currency: "USDC",
						status: "completed",
						counterpartyName: "John Doe",
						counterpartyPhone: "+233 24 123 4567",
					},
					{
						id: "4",
						kind: "scan_pay",
						title: "Scan & Pay",
						timestamp: "Yesterday, 10:26 AM",
						date: "5 September, 2026",
						txId: "RQZLKD7793WEUAF2NCJT5HBOMXYV",
						amount: -500,
						currency: "USDC",
						status: "completed",
					},
				],
				1200,
			),
	});
}

export {
	useGreeting,
	useWalletBalance,
	useQuickActionsReady,
	useRecentTransactions,
};
export type { GreetingData, WalletBalanceSummary, Transaction, TransactionKind };
