import { isAxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import type {
	ApiSuccessResponse,
	FundCurrency,
	FundQuoteData,
	FundWalletResultData,
	StellarWalletData,
} from "@/lib/api/types";

const MY_WALLET_KEY = ["wallet", "mine"];

/**
 * The wallet this account should display/fund — always the account's own
 * `GET /wallets/stellar`, for both individual and merchant. Previously
 * looked up a merchant's separate BUSINESS wallet via
 * `GET /wallets/stellar/list` instead; reverted to this single endpoint on
 * request — no wallet listing for now. Returns `null` (not an error) for
 * "no wallet yet" (shouldn't normally happen — sign-up's own `SetPinForm`
 * already creates it for every account type — but the type allows it).
 */
function useMyWallet() {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: MY_WALLET_KEY,
		queryFn: async (): Promise<StellarWalletData | null> => {
			try {
				const { data } = await axiosAuth.get<ApiSuccessResponse<StellarWalletData>>(
					apiRoutes.wallets.STELLAR,
				);
				return data.data;
			} catch (error) {
				if (isAxiosError(error) && error.response?.status === 404) return null;
				throw error;
			}
		},
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

export { useMyWallet, useFundQuote, useFundWallet };
