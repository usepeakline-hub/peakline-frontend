import { useQuery } from "@tanstack/react-query";

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

interface BalanceData {
	amount: number;
	currency: string;
	localAmount: number;
	localCurrency: string;
}

function useWalletBalance() {
	return useQuery({
		queryKey: ["dashboard", "balance"],
		queryFn: () =>
			fakeRequest<BalanceData>(
				{ amount: 1200, currency: "USDC", localAmount: 1245, localCurrency: "GHS" },
				800,
			),
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
						amount: 1000,
						currency: "USDC",
						status: "completed",
					},
					{
						id: "2",
						kind: "sent",
						title: "Payment to John Doe",
						timestamp: "Today, 10:26 AM",
						amount: -500,
						currency: "USDC",
						status: "completed",
					},
					{
						id: "3",
						kind: "received",
						title: "Received from John Doe",
						timestamp: "Today, 10:26 AM",
						amount: 1000,
						currency: "USDC",
						status: "completed",
					},
					{
						id: "4",
						kind: "scan_pay",
						title: "Scan & Pay",
						timestamp: "Yesterday, 10:26 AM",
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
export type { GreetingData, BalanceData, Transaction, TransactionKind };
