import { useQuery } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import type { AdminTransactionData, AdminTransactionsQuery, PaginatedResponse } from "@/lib/api/types";

const TRANSACTIONS_KEY = ["admin", "transactions"];

function useAdminTransactions(query: AdminTransactionsQuery, page: number, limit: number) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...TRANSACTIONS_KEY, query, page, limit],
		queryFn: async () => {
			const { data } = await axiosAuth.get<PaginatedResponse<AdminTransactionData>>(
				apiRoutes.transactions.BASE,
				{ params: { ...query, page, limit } },
			);
			return { transactions: data.data, meta: data.meta };
		},
	});
}

/** `GET /admin/transactions/{id}`'s real response schema is undocumented
 * (see `AdminTransactionData`'s own note) — typed as `unknown` and narrowed
 * defensively at render time instead of trusting a guessed shape outright. */
function useAdminTransaction(id: string) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...TRANSACTIONS_KEY, id],
		queryFn: async () => {
			const { data } = await axiosAuth.get<{ data: unknown }>(apiRoutes.transactions.byId(id));
			return data.data as AdminTransactionData;
		},
		enabled: !!id,
	});
}

export { useAdminTransactions, useAdminTransaction };
