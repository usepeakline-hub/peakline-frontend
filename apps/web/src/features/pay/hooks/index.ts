import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FAKE_MERCHANT, type FakeMerchant } from "@/lib/pay";
import type { PayFlowValues } from "@/features/pay/store/payFlowStore";

// TODO: replace with real calls into the ledger/merchant APIs once they exist.
async function fakeRequest<T>(payload: T, delay = 800): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, delay));
	return payload;
}

/** Stands in for scanning + decoding a merchant's QR code — there's no
 * camera access here (that's a real device-permission feature well beyond
 * this fake-backend demo), so "Open camera to scan" just resolves to the
 * same fake merchant after a short delay standing in for a real scan. */
function useScanMerchantQr() {
	return useMutation({
		mutationFn: () => fakeRequest<FakeMerchant>(FAKE_MERCHANT, 1200),
	});
}

// Fails about 1 in 4 times on purpose — mirrors useProcessFunding/
// useProcessTransfer, so the Payment Failed step is actually reachable.
async function fakeProcessPayment(values: PayFlowValues) {
	await new Promise((resolve) => setTimeout(resolve, 1800));
	if (Math.random() < 0.25) {
		throw new Error("Payment could not be processed");
	}
	return values;
}

function useProcessPayment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: fakeProcessPayment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dashboard", "balance"] });
		},
	});
}

export { useScanMerchantQr, useProcessPayment };
