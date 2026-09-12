import { useQuery } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import type { AdminUserData, AdminUsersQuery, PaginatedResponse } from "@/lib/api/types";

const USERS_KEY = ["admin", "users"];

/** `GET /admin/users` — server-side filtered/paginated, confirmed live. */
function useAdminUsers(query: AdminUsersQuery, page: number, limit: number) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...USERS_KEY, query, page, limit],
		queryFn: async () => {
			const { data } = await axiosAuth.get<PaginatedResponse<AdminUserData>>(
				apiRoutes.users.BASE,
				{ params: { ...query, page, limit } },
			);
			return { users: data.data, meta: data.meta };
		},
	});
}

/** No shared cache entry with the list above — server-paginated, so a user
 * viewed here isn't guaranteed to be on whatever page the list last
 * fetched (same reasoning apps/web's own detail hooks use throughout). */
function useAdminUser(id: string) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...USERS_KEY, id],
		queryFn: async () => {
			const { data } = await axiosAuth.get<{ data: AdminUserData }>(
				apiRoutes.users.byId(id),
			);
			return data.data;
		},
		enabled: !!id,
	});
}

export { useAdminUsers, useAdminUser };
