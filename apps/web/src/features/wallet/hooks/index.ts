import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FundWalletValues } from "@/lib/validations/walletValidations";

// TODO: replace with real calls into the wallet/ledger API once it exists.
async function fakeRequest<T>(payload: T, delay = 800): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, delay));
	return payload;
}

// Fails about 1 in 4 times on purpose — with no real backend yet, that's
// the only way to actually exercise the Failed step rather than leaving it
// dead code.
async function fakeProcessFunding(values: FundWalletValues) {
	await new Promise((resolve) => setTimeout(resolve, 1800));
	if (Math.random() < 0.25) {
		throw new Error("Funding could not be processed");
	}
	return values;
}

/** Fired by the Processing step on mount. Success invalidates the
 * dashboard's balance query so it refetches (the fake backend doesn't
 * actually persist the new balance, so the number itself won't move — but
 * the refetch itself is real, standing in for what a real one would do). */
function useProcessFunding() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: fakeProcessFunding,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dashboard", "balance"] });
		},
	});
}

interface PendingBalanceData {
	amount: number;
	currency: string;
}

/** Funds in flight (e.g. a funding transaction still settling) — shown on
 * the Wallet page under Available Balance. */
function usePendingBalance() {
	return useQuery({
		queryKey: ["wallet", "pending-balance"],
		queryFn: () =>
			fakeRequest<PendingBalanceData>({ amount: 1200, currency: "USDC" }, 950),
	});
}

export { useProcessFunding, usePendingBalance };
