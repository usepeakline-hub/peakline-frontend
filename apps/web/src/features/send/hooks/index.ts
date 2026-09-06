import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SendMoneyValues } from "@/lib/validations/sendValidations";

// Fails about 1 in 4 times on purpose — mirrors the Fund Wallet hook, so the
// Transfer Failed step is actually reachable without a real backend.
async function fakeProcessTransfer(values: SendMoneyValues) {
	await new Promise((resolve) => setTimeout(resolve, 1800));
	if (Math.random() < 0.25) {
		throw new Error("Transfer could not be processed");
	}
	return values;
}

/** Fired by the Processing step on mount. Success invalidates the
 * dashboard's balance query so it refetches (see the equivalent note on
 * `useProcessFunding` — the fake backend doesn't persist the new balance,
 * but the refetch itself stands in for what a real one would trigger). */
function useProcessTransfer() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: fakeProcessTransfer,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dashboard", "balance"] });
		},
	});
}

export { useProcessTransfer };
