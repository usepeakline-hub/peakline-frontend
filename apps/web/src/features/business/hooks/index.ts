import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import type { ApiSuccessResponse, BusinessData } from "@/lib/api/types";
import type { UpdateBusinessValues } from "@/lib/validations/businessValidations";

const MY_BUSINESS_KEY = ["business", "mine"];

/** `GET /businesses` returns every business the account owns, but the app
 * only ever creates one per merchant (see the sign-up onboarding step) —
 * this surfaces just the first, same "one business per merchant" assumption
 * the rest of the app already makes (e.g. `FAKE_BUSINESS_NAME`). Returns
 * `undefined` (not an error) for a merchant account that skipped/never
 * completed Business Information. */
function useMyBusiness() {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: MY_BUSINESS_KEY,
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<BusinessData[]>>(
				apiRoutes.businesses.BASE,
			);
			return data.data[0] ?? null;
		},
	});
}

function useUpdateBusiness(id: string) {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (values: UpdateBusinessValues) => {
			const { data } = await axiosAuth.patch<ApiSuccessResponse<BusinessData>>(
				apiRoutes.businesses.byId(id),
				{
					name: values.name,
					category: values.category,
					country: values.country,
					city: values.city || undefined,
					address: values.address || undefined,
					phone: values.phone || undefined,
					website: values.website || undefined,
					description: values.description || undefined,
					registrationNumber: values.registrationNumber || undefined,
					taxId: values.taxId || undefined,
				},
			);
			return data.data;
		},
		onSuccess: (business) => queryClient.setQueryData(MY_BUSINESS_KEY, business),
	});
}

/** Soft delete — the business stops appearing in `GET /businesses`
 * afterward (per the endpoint's own description), so invalidating is
 * enough to make it disappear from the card too. */
function useDeleteBusiness(id: string) {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => axiosAuth.delete(apiRoutes.businesses.byId(id)),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_BUSINESS_KEY }),
	});
}

export { useMyBusiness, useUpdateBusiness, useDeleteBusiness };
