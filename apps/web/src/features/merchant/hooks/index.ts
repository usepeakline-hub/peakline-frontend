import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/authStore";
import type { Transaction } from "@/features/dashboard/hooks";
import type { CreatePaymentLinkValues } from "@/lib/validations/paymentLinksValidations";

// TODO: replace with a real call into the merchant/payments API once it
// exists.
async function fakeRequest<T>(payload: T, delay = 800): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, delay));
	return payload;
}

interface MerchantOverviewData {
	totalReceived: number;
	totalReceivedChangePct: number;
	todaysPayments: number;
	todaysPaymentsChangePct: number;
	pending: number;
	pendingCount: number;
	currency: string;
}

/** Merchant Overview's three headline stats — a merchant-specific query,
 * distinct from the individual dashboard's `useWalletBalance` (a single
 * spendable balance means nothing to a merchant's own "how's business
 * going" view). */
function useMerchantOverview() {
	return useQuery({
		queryKey: ["merchant", "overview"],
		queryFn: () =>
			fakeRequest<MerchantOverviewData>({
				totalReceived: 24000,
				totalReceivedChangePct: 5.2,
				todaysPayments: 4000,
				todaysPaymentsChangePct: 5.2,
				pending: 2000,
				pendingCount: 2,
				currency: "USDC",
			}),
	});
}

/** The trend chart under Overview's "Total Received" heading — one month
 * "selected" (Apr in the mock, both breakpoints) as the highlighted x-axis
 * label. The mock's own headline number (4,250 USDC) doesn't match this
 * chart's Y-axis scale (tens of thousands) — kept exactly as shown rather
 * than inventing a reconciliation between the two, same as the standalone
 * "Total Received" stat card's own $24,000 figure not matching either. */
export type ReceivedTrendPeriod = "week" | "month" | "year";

interface ReceivedTrendPoint {
	label: string;
	amount: number;
}

interface ReceivedTrendData {
	total: number;
	currency: string;
	selectedLabel: string;
	points: ReceivedTrendPoint[];
}

// The mock only ever shows "This month" — these other two periods are a
// real (if simple) response to picking them, not a dead dropdown.
const RECEIVED_TREND_BY_PERIOD: Record<ReceivedTrendPeriod, ReceivedTrendData> = {
	month: {
		total: 4250,
		currency: "USDC",
		selectedLabel: "Apr",
		points: [
			{ label: "Jan", amount: 45000 },
			{ label: "Feb", amount: 65000 },
			{ label: "Mar", amount: 42000 },
			{ label: "Apr", amount: 85000 },
			{ label: "May", amount: 48000 },
			{ label: "Jun", amount: 70000 },
			{ label: "Jul", amount: 65000 },
			{ label: "Aug", amount: 58000 },
		],
	},
	week: {
		total: 1180,
		currency: "USDC",
		selectedLabel: "Thu",
		points: [
			{ label: "Mon", amount: 12000 },
			{ label: "Tue", amount: 18000 },
			{ label: "Wed", amount: 9000 },
			{ label: "Thu", amount: 24000 },
			{ label: "Fri", amount: 16000 },
			{ label: "Sat", amount: 20000 },
			{ label: "Sun", amount: 11000 },
		],
	},
	year: {
		total: 38900,
		currency: "USDC",
		selectedLabel: "2025",
		points: [
			{ label: "2022", amount: 210000 },
			{ label: "2023", amount: 340000 },
			{ label: "2024", amount: 295000 },
			{ label: "2025", amount: 410000 },
		],
	},
};

function useReceivedTrend(period: ReceivedTrendPeriod) {
	return useQuery({
		queryKey: ["merchant", "received-trend", period],
		queryFn: () => fakeRequest(RECEIVED_TREND_BY_PERIOD[period], 700),
	});
}

const RECENT_PAYMENT_CUSTOMERS = [
	"John Doe",
	"Janet John",
	"Ama Serwaa",
	"Kwame Boateng",
	"Kojo Mensah",
] as const;

/** Deterministic, not random — a fixed 50-row fake dataset so pagination
 * always lands on the same content instead of reshuffling on every
 * refetch. */
function generateFakeRecentPayments(count: number): Transaction[] {
	const methods: NonNullable<Transaction["paymentMethod"]>[] = ["qr", "link"];
	const statuses: Transaction["status"][] = ["completed", "completed", "completed", "pending", "failed"];

	return Array.from({ length: count }, (_, i) => {
		const customer = RECENT_PAYMENT_CUSTOMERS[i % RECENT_PAYMENT_CUSTOMERS.length];
		return {
			id: `rp${i + 1}`,
			kind: "received",
			title: `Received from ${customer}`,
			timestamp: "12 Aug 2026, 11:57 AM",
			date: "12 Aug 2026",
			isoDate: "2026-08-12",
			txId: `HIGUFYRTE${465987 + i}`,
			amount: 500,
			currency: "USDC",
			status: statuses[i % statuses.length],
			counterpartyName: customer,
			paymentMethod: methods[i % methods.length],
		};
	});
}

const FAKE_RECENT_PAYMENTS = generateFakeRecentPayments(50);

interface PaginatedPayments {
	items: Transaction[];
	total: number;
}

/** Overview's own "Recent Payments" — a real, paginated slice of a larger
 * (fake) dataset, distinct from `useMerchantPayments` (the full
 * `/payments` page's own, separately-sized fake list). Client-side paging
 * over an already-fetched array for now, same "fake but genuinely does the
 * thing" spirit as `PaymentsList`'s CSV export — real pagination logic,
 * just no real backend behind it yet. */
function useRecentPayments(page: number, pageSize: number) {
	return useQuery({
		queryKey: ["merchant", "recent-payments", page, pageSize],
		queryFn: () => {
			const start = (page - 1) * pageSize;
			return fakeRequest<PaginatedPayments>(
				{
					items: FAKE_RECENT_PAYMENTS.slice(start, start + pageSize),
					total: FAKE_RECENT_PAYMENTS.length,
				},
				500,
			);
		},
	});
}

// TODO: source the real business name from Business Information once that
// onboarding step has a backend to persist it — same fake-default gap as
// the individual dashboard's own `userName` prop.
const FAKE_BUSINESS_NAME = "Kwame Enterprise";

/** The identity to show for this account — the business name once
 * merchant, whatever the caller would've shown otherwise (typically a
 * personal name) for an individual. Shared by `Topbar` and
 * `GreetingHeader`'s mobile avatar so the two can't drift apart. */
function useAccountDisplayName(individualName: string) {
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");
	return isMerchant ? FAKE_BUSINESS_NAME : individualName;
}

/** The merchant's own "Payments" list (all incoming customer payments) —
 * distinct from the general `/transactions` ledger, which also has to cover
 * outgoing activity a plain payments view has no use for. Every entry is
 * `kind: "received"` and carries a `paymentMethod`, unlike the shared
 * `Transaction` shape's other consumers. Reused by the Payments detail page
 * (finds by id from this same cached list, same pattern as
 * `useTransactionHistory` + `/transactions/[id]`). */
function useMerchantPayments() {
	return useQuery({
		queryKey: ["merchant", "payments"],
		queryFn: () =>
			fakeRequest<Transaction[]>(
				[
					{
						id: "p1",
						kind: "received",
						title: "Received from Janet John",
						timestamp: "July 12, 2025",
						date: "12 July, 2025",
						isoDate: "2025-07-12",
						txId: "QKPMFZ8815WRJTNC3XYA6LOEHUDG",
						amount: 500,
						currency: "USDC",
						status: "pending",
						counterpartyName: "Janet John",
						counterpartyPhone: "+233 958 3476 4972",
						paymentMethod: "qr",
					},
					{
						id: "p2",
						kind: "received",
						title: "Received from Janet John",
						timestamp: "July 12, 2025",
						date: "12 July, 2025",
						isoDate: "2025-07-12",
						txId: "BJFWHUF9824BPFNJEUH8PI98EBOQ",
						amount: 500,
						currency: "USDC",
						status: "completed",
						counterpartyName: "Janet John",
						counterpartyPhone: "+233 958 3476 4972",
						paymentMethod: "link",
					},
					{
						id: "p3",
						kind: "received",
						title: "Received from Janet John",
						timestamp: "July 12, 2025",
						date: "12 July, 2025",
						isoDate: "2025-07-12",
						txId: "TVXBHE2358OQKASD9FGH1MNZLPWC",
						amount: 500,
						currency: "USDC",
						status: "failed",
						counterpartyName: "Janet John",
						counterpartyPhone: "+233 958 3476 4972",
						paymentMethod: "qr",
					},
					{
						id: "p4",
						kind: "received",
						title: "Received from Janet John",
						timestamp: "July 12, 2025",
						date: "12 July, 2025",
						isoDate: "2025-07-12",
						txId: "RQZLKD7793WEUAF2NCJT5HBOMXYV",
						amount: 500,
						currency: "USDC",
						status: "completed",
						counterpartyName: "Janet John",
						counterpartyPhone: "+233 958 3476 4972",
						paymentMethod: "qr",
					},
				],
				1000,
			),
	});
}

export type PaymentLinkStatus = "active" | "paid" | "expired";

export interface PaymentLink {
	id: string;
	title: string;
	amount: number;
	currency: string;
	description?: string;
	reference?: string;
	/** Display string. */
	expiration: string;
	/** ISO date, for real date-range filtering (same reasoning as
	 * `Transaction.isoDate`). */
	isoExpiration: string;
	status: PaymentLinkStatus;
	link: string;
}

/**
 * Payment Links — replaces "Request Payment" for merchant accounts (same
 * underlying create-a-shareable-link idea `useCreatePaymentRequest`
 * already covers, plus a title and its own persistent list/history here).
 * Individual keeps the original `/request-payment` untouched.
 */
function useMerchantPaymentLinks() {
	return useQuery({
		queryKey: ["merchant", "payment-links"],
		queryFn: () =>
			fakeRequest<PaymentLink[]>([
				{
					id: "l1",
					title: "Blue Dress Order",
					amount: 500,
					currency: "USDC",
					description: "Payment for blue dress",
					reference: "INV-001",
					expiration: "20 July, 2025",
					isoExpiration: "2025-07-20",
					status: "active",
					link: "https://peakline.com/pay/kwame-enterprise/l1",
				},
				{
					id: "l2",
					title: "Shoes — Order #245",
					amount: 500,
					currency: "USDC",
					expiration: "15 July, 2025",
					isoExpiration: "2025-07-15",
					status: "paid",
					link: "https://peakline.com/pay/kwame-enterprise/l2",
				},
				{
					id: "l3",
					title: "Custom Tailoring Order",
					amount: 500,
					currency: "USDC",
					description: "Tailoring service",
					reference: "INV-002",
					expiration: "5 July, 2025",
					isoExpiration: "2025-07-05",
					status: "expired",
					link: "https://peakline.com/pay/kwame-enterprise/l3",
				},
				{
					id: "l4",
					title: "Bag Deposit",
					amount: 500,
					currency: "USDC",
					expiration: "25 July, 2025",
					isoExpiration: "2025-07-25",
					status: "paid",
					link: "https://peakline.com/pay/kwame-enterprise/l4",
				},
			]),
	});
}

interface PaymentLinkResult {
	link: string;
}

function useCreatePaymentLink() {
	return useMutation({
		mutationFn: (values: CreatePaymentLinkValues) =>
			fakeRequest<PaymentLinkResult>({
				link: `https://peakline.com/pay/kwame-enterprise/${values.title
					.toLowerCase()
					.trim()
					.replace(/\s+/g, "-")}`,
			}),
	});
}

/** Fake link encoded into the merchant's store QR code — same "no real
 * per-account link from a backend yet" gap as `FAKE_PAYMENT_LINK`
 * (individual's own equivalent, `@/lib/receive`). */
const FAKE_MERCHANT_QR_LINK = "https://peakline.com/pay/kwame-enterprise";

export {
	useMerchantOverview,
	useAccountDisplayName,
	useMerchantPayments,
	useMerchantPaymentLinks,
	useCreatePaymentLink,
	useReceivedTrend,
	useRecentPayments,
	FAKE_BUSINESS_NAME,
	FAKE_MERCHANT_QR_LINK,
};
export type { MerchantOverviewData, ReceivedTrendPoint };
