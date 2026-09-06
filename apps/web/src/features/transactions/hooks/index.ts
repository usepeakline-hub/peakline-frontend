import { useQuery } from "@tanstack/react-query";
import type { Transaction } from "@/features/dashboard/hooks";

// TODO: replace with real calls into the ledger API once it exists.
async function fakeRequest<T>(payload: T, delay = 1000): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, delay));
	return payload;
}

/** The full history behind the dashboard's abbreviated "Recent
 * Transactions" (latest 4 only) — same fake shape, more entries and a
 * couple of the statuses the dashboard's fixed sample never shows, since
 * this page's whole purpose is being the "view all" destination (and, per
 * each row linking to `/transactions/[id]`, the source for transaction
 * detail lookups too). */
function useTransactionHistory() {
	return useQuery({
		queryKey: ["transactions", "history"],
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
						kind: "sent",
						title: "Transfer to Ama Serwaa",
						timestamp: "Today, 9:02 AM",
						date: "6 September, 2026",
						txId: "PXWLVA6602KDHZSF3MRT8QGYENJC",
						amount: -100,
						currency: "USDC",
						status: "processing",
						counterpartyName: "Ama Serwaa",
						counterpartyPhone: "+233 20 445 8821",
					},
					{
						id: "4",
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
						id: "5",
						kind: "scan_pay",
						title: "Scan & Pay",
						timestamp: "Yesterday, 10:26 AM",
						date: "5 September, 2026",
						txId: "RQZLKD7793WEUAF2NCJT5HBOMXYV",
						amount: -500,
						currency: "USDC",
						status: "completed",
					},
					{
						id: "6",
						kind: "sent",
						title: "Transfer to Kojo Mensah",
						timestamp: "Yesterday, 4:18 PM",
						date: "5 September, 2026",
						txId: "HNFCZQ1184UWAB7XTKS2VOJDMLYR",
						amount: -250,
						currency: "USDC",
						status: "failed",
						counterpartyName: "Kojo Mensah",
						counterpartyPhone: "+233 27 981 2246",
					},
					{
						id: "7",
						kind: "received",
						title: "Received from Kwame Boateng",
						timestamp: "Yesterday, 1:47 PM",
						date: "5 September, 2026",
						txId: "WDOQAM5527JCFRZ9YENH3PVTXKLB",
						amount: 300,
						currency: "USDC",
						status: "pending",
						counterpartyName: "Kwame Boateng",
						counterpartyPhone: "+233 54 302 7719",
					},
					{
						id: "8",
						kind: "scan_pay",
						title: "Scan & Pay",
						timestamp: "Mon, 11:05 AM",
						date: "1 September, 2026",
						txId: "LSKYPT8836EGNVA4ZHQR7CMWDOJF",
						amount: -75,
						currency: "USDC",
						status: "completed",
					},
					{
						id: "9",
						kind: "sent",
						title: "Transfer to Ama Serwaa",
						timestamp: "Sun, 6:30 PM",
						date: "31 August, 2026",
						txId: "ZNRHUC2291MXFLVA6WBJ9QKDYEST",
						amount: -600,
						currency: "USDC",
						status: "cancelled",
						counterpartyName: "Ama Serwaa",
						counterpartyPhone: "+233 20 445 8821",
					},
					{
						id: "10",
						kind: "received",
						title: "Received from John Doe",
						timestamp: "Sun, 9:15 AM",
						date: "31 August, 2026",
						txId: "FMEQOX7743VDNBK1RTHA5UYGLZWJ",
						amount: 1000,
						currency: "USDC",
						status: "completed",
						counterpartyName: "John Doe",
						counterpartyPhone: "+233 24 123 4567",
					},
				],
				1000,
			),
	});
}

export { useTransactionHistory };
