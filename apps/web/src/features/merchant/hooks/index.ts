import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import { useAuthStore } from "@/lib/stores/authStore";
import { useMyBusiness } from "@/features/business/hooks";
import type { Transaction } from "@/features/dashboard/hooks";
import type {
	ApiSuccessResponse,
	MerchantDashboardStatsData,
	PaginationMeta,
	PaymentLinkData,
	PaymentLinkStatsData,
	PaymentLinkStatus,
} from "@/lib/api/types";
import type { CreatePaymentLinkValues } from "@/lib/validations/paymentLinksValidations";

// TODO: replace with a real call into the merchant/payments API once it
// exists.
async function fakeRequest<T>(payload: T, delay = 800): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, delay));
	return payload;
}

export type ReceivedTrendPeriod = "week" | "month" | "year";

/** "previous_month" -> "vs previous month" — `changeVsLabel` isn't a fixed
 * enum the docs pin down, so this humanizes whatever snake_case string
 * comes back instead of hardcoding "this month" for every stat (the fake
 * version said that for both Total Received *and* Today's Payments, even
 * though the latter really compares against yesterday). */
function humanizeChangeLabel(label: string) {
	return `vs ${label.replace(/_/g, " ")}`;
}

/** Both Overview's three stat cards and its Total Received chart come from
 * this one real endpoint (`GET /merchant/dashboard/stats`) — `period` only
 * changes the `chart` field, so `useMerchantOverview` calls it with a fixed
 * period (the other three fields don't vary by period) while
 * `useReceivedTrend` passes through whatever the chart's own selector
 * chose. Same query key when both happen to want "month" lets React Query
 * dedupe the two into one request. */
function useMerchantDashboardStats(period: ReceivedTrendPeriod) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: ["merchant", "dashboard-stats", period],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<MerchantDashboardStatsData>>(
				apiRoutes.merchant.DASHBOARD_STATS,
				{ params: { period } },
			);
			return data.data;
		},
	});
}

interface MerchantOverviewData {
	totalReceived: number;
	totalReceivedChangePct: number | null;
	totalReceivedChangeLabel: string;
	todaysPayments: number;
	todaysPaymentsChangePct: number | null;
	todaysPaymentsChangeLabel: string;
	pending: number;
	pendingCount: number;
	currency: string;
}

/** Merchant Overview's three headline stats — a merchant-specific query,
 * distinct from the individual dashboard's `useWalletBalance` (a single
 * spendable balance means nothing to a merchant's own "how's business
 * going" view). Real as of `GET /merchant/dashboard/stats`. */
function useMerchantOverview() {
	const { data, ...rest } = useMerchantDashboardStats("month");

	const overview: MerchantOverviewData | undefined = data && {
		totalReceived: Number(data.totalReceived.amount),
		totalReceivedChangePct: data.totalReceived.changePct,
		totalReceivedChangeLabel: humanizeChangeLabel(data.totalReceived.changeVsLabel),
		todaysPayments: Number(data.todaysPayments.amount),
		todaysPaymentsChangePct: data.todaysPayments.changePct,
		todaysPaymentsChangeLabel: humanizeChangeLabel(data.todaysPayments.changeVsLabel),
		pending: Number(data.pending.amount),
		pendingCount: data.pending.count,
		currency: data.totalReceived.currency,
	};

	return { ...rest, data: overview };
}

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

/** The trend chart under Overview's "Total Received" heading. Real as of
 * the same `GET /merchant/dashboard/stats` `useMerchantOverview` uses, just
 * reading `chart` instead — there's no "selected" bucket in the real
 * response (the mock's own highlighted "Apr" pill was never more than
 * decorative), so this highlights the most recent bucket instead, the
 * closest real equivalent to "the current period". */
function useReceivedTrend(period: ReceivedTrendPeriod) {
	const { data, ...rest } = useMerchantDashboardStats(period);

	const trend: ReceivedTrendData | undefined = data && {
		total: Number(data.chart.total),
		currency: data.chart.currency,
		selectedLabel: data.chart.buckets.at(-1)?.label ?? "",
		points: data.chart.buckets.map((bucket) => ({
			label: bucket.label,
			amount: Number(bucket.value),
		})),
	};

	return { ...rest, data: trend };
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

/** Merchant's own `/transactions` — same underlying 50-row fake dataset as
 * `useRecentPayments` (Overview's preview is a slice of exactly this same
 * ledger, not a different one), but fetched whole so `TransactionsList` can
 * filter/paginate it client-side the same way `PaymentsList` does. Also the
 * lookup source `/transactions/[id]` reads from for a merchant session — see
 * that page's own `isMerchant` branch. */
function useMerchantTransactions() {
	return useQuery({
		queryKey: ["merchant", "transactions"],
		queryFn: () => fakeRequest<Transaction[]>(FAKE_RECENT_PAYMENTS),
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

const PAYMENT_LINKS_KEY = ["merchant", "payment-links"];

export interface PaymentLinksQuery {
	q?: string;
	status?: PaymentLinkStatus;
	from?: string;
	to?: string;
}

/**
 * Payment Links — real `/payment-links` endpoints, replacing the earlier
 * fake single-cached-array version. Server-side filtered/paginated
 * (`q`/`status`/`from`/`to`/`page`/`limit`) rather than fetched-once and
 * sliced client-side, so every filter/page change re-fetches.
 */
function useMerchantPaymentLinks(query: PaymentLinksQuery, page: number, limit: number) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...PAYMENT_LINKS_KEY, query, page, limit],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaymentLinkData[]> & { meta: PaginationMeta }
			>(apiRoutes.paymentLinks.BASE, { params: { ...query, page, limit } });
			return { links: data.data, meta: data.meta };
		},
	});
}

/** No dedicated cache entry shared with the list above — the list is now
 * properly server-paginated, so a link viewed on the detail page isn't
 * guaranteed to be in whatever page the list last fetched. */
function useMerchantPaymentLink(id: string) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...PAYMENT_LINKS_KEY, id],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<PaymentLinkData>>(
				apiRoutes.paymentLinks.byId(id),
			);
			return data.data;
		},
		enabled: !!id,
	});
}

function usePaymentLinksStats() {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...PAYMENT_LINKS_KEY, "stats"],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<PaymentLinkStatsData>>(
				apiRoutes.paymentLinks.STATS,
			);
			return data.data;
		},
	});
}

function useCreatePaymentLink() {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();
	const { data: business } = useMyBusiness();

	return useMutation({
		mutationFn: async (values: CreatePaymentLinkValues) => {
			if (!business) {
				throw new Error("Add a business before creating a payment link.");
			}
			// `expiration` is a date-only value off a `type="date"` input —
			// widen to the end of that day (UTC) so the link stays usable
			// through the whole day it's shown as expiring on, rather than
			// expiring at midnight.
			const expiresAt = new Date(`${values.expiration}T23:59:59.999Z`).toISOString();
			const { data } = await axiosAuth.post<ApiSuccessResponse<PaymentLinkData>>(
				apiRoutes.paymentLinks.BASE,
				{
					title: values.title,
					amount: values.amount,
					currency: "USDC",
					businessId: business.id,
					expiresAt,
					description: values.description || undefined,
					customerReference: values.reference || undefined,
				},
			);
			return data.data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: PAYMENT_LINKS_KEY }),
	});
}

function useCancelPaymentLink() {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<PaymentLinkData>>(
				apiRoutes.paymentLinks.byIdCancel(id),
			);
			return data.data;
		},
		onSuccess: (link) => {
			queryClient.setQueryData([...PAYMENT_LINKS_KEY, link.id], link);
			queryClient.invalidateQueries({ queryKey: PAYMENT_LINKS_KEY });
		},
	});
}

/** Blob download, same reasoning as the QR-code PNG download — a plain
 * `<a href>` wouldn't carry the `Authorization` header the proxy's
 * interceptor attaches. Runs the same filters as the list/stats views. */
function useExportPaymentLinksCsv() {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async (query: PaymentLinksQuery) => {
			const response = await axiosAuth.get<Blob>(apiRoutes.paymentLinks.EXPORT_CSV, {
				params: query,
				responseType: "blob",
			});
			const url = URL.createObjectURL(response.data);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = `payment-links-${new Date().toISOString().slice(0, 10)}.csv`;
			anchor.click();
			URL.revokeObjectURL(url);
		},
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
	useMerchantTransactions,
	useMerchantPaymentLinks,
	useMerchantPaymentLink,
	usePaymentLinksStats,
	useCreatePaymentLink,
	useCancelPaymentLink,
	useExportPaymentLinksCsv,
	useReceivedTrend,
	useRecentPayments,
	FAKE_BUSINESS_NAME,
	FAKE_MERCHANT_QR_LINK,
};
export type { MerchantOverviewData, ReceivedTrendPoint, PaymentLinkStatus };
