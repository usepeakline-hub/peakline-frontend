import { useQuery } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import type { AdminBusinessData, AdminBusinessesQuery, PaginatedResponse } from "@/lib/api/types";

const BUSINESSES_KEY = ["admin", "businesses"];

function useAdminBusinesses(query: AdminBusinessesQuery, page: number, limit: number) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...BUSINESSES_KEY, query, page, limit],
		queryFn: async () => {
			const { data } = await axiosAuth.get<PaginatedResponse<AdminBusinessData>>(
				apiRoutes.businesses.BASE,
				{ params: { ...query, page, limit } },
			);
			return { businesses: data.data, meta: data.meta };
		},
	});
}

function useAdminBusiness(id: string) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...BUSINESSES_KEY, id],
		queryFn: async () => {
			const { data } = await axiosAuth.get<{ data: AdminBusinessData }>(
				apiRoutes.businesses.byId(id),
			);
			return data.data;
		},
		enabled: !!id,
	});
}

export { useAdminBusinesses, useAdminBusiness };
