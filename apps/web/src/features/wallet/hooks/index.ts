import { isAxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import { useAuthStore } from "@/lib/stores/authStore";
import { useMyBusiness } from "@/features/business/hooks";
import type {
	ApiSuccessResponse,
	FundCurrency,
	FundQuoteData,
	FundWalletResultData,
	StellarWalletData,
} from "@/lib/api/types";

const MY_WALLET_KEY = ["wallet", "mine"];

/**
 * The wallet this account should display/fund. An individual has exactly
 * one personal wallet (`GET /wallets/stellar`). A merchant's own money
 * moves through their BUSINESS wallet instead — that's what a Payment
 * Link's `destinationAddress` actually pays into — found via
 * `GET /wallets/stellar/list` (personal wallet + every business wallet you
 * own, each tagged with its own `business` object) matched against
 * `useMyBusiness()`. Resolves the earlier open question of which wallet the
 * merchant UI actually means, rather than silently pointing at the
 * account's own personal wallet (which nothing else in the merchant
 * experience ever pays into).
 *
 * Returns `null` (not an error) for "no wallet yet" — an individual mid
 * sign-up before `useSetupWallet` ran, or a merchant whose business hasn't
 * had a wallet provisioned yet (see `useCreateBusinessWallet`).
 */
function useMyWallet() {
	const axiosAuth = useAxiosAuth();
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");
	const { data: business, isLoading: isLoadingBusiness } = useMyBusiness({
		enabled: isMerchant,
	});

	return useQuery({
		queryKey: [...MY_WALLET_KEY, isMerchant, business?.id ?? null],
		queryFn: async (): Promise<StellarWalletData | null> => {
			if (!isMerchant) {
				try {
					const { data } = await axiosAuth.get<ApiSuccessResponse<StellarWalletData>>(
						apiRoutes.wallets.STELLAR,
					);
					return data.data;
				} catch (error) {
					if (isAxiosError(error) && error.response?.status === 404) return null;
					throw error;
				}
			}

			if (!business) return null;
			const { data } = await axiosAuth.get<ApiSuccessResponse<StellarWalletData[]>>(
				apiRoutes.wallets.LIST,
			);
			return data.data.find((wallet) => wallet.business?.id === business.id) ?? null;
		},
		enabled: isMerchant ? !isLoadingBusiness : true,
	});
}

/** Provisions the wallet for a merchant's own business — the empty-state
 * action when `useMyWallet` resolves to `null` for a merchant who has a
 * business but no wallet on it yet. */
function useCreateBusinessWallet(businessId: string) {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<StellarWalletData>>(
				apiRoutes.businesses.byIdWallet(businessId),
			);
			return data.data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_WALLET_KEY }),
	});
}

/** A preview, not an action — `POST /wallets/stellar/fund/quote`. */
function useFundQuote() {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async (input: { amount: number; currency: FundCurrency }) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<FundQuoteData>>(
				apiRoutes.wallets.FUND_QUOTE,
				{ amount: input.amount.toFixed(2), currency: input.currency },
			);
			return data.data;
		},
	});
}

/** The real action — deposits free test USDC into `address` via the
 * platform's testnet faucet. Fired by the Processing step on mount. */
function useFundWallet() {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: { address: string; amount: string }) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<FundWalletResultData>>(
				apiRoutes.wallets.FUND,
				input,
			);
			return data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dashboard", "balance"] });
		},
	});
}

export { useMyWallet, useCreateBusinessWallet, useFundQuote, useFundWallet };
