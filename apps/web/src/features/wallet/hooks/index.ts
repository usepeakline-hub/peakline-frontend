import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FundWalletValues } from "@/lib/validations/walletValidations";

// TODO: replace with a real call into the wallet/ledger API once one exists
// for actually submitting a funding request (POST /wallets/stellar/fund
// funds a *testnet* wallet directly — a different thing from "process this
// funding form" here). Fails about 1 in 4 times on purpose — with no real backend yet, that's
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

export { useProcessFunding };
