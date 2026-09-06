import { create } from "zustand";
import type { FakeMerchant } from "@/lib/pay";

interface PayFlowValues {
	merchant: FakeMerchant;
	amount: number;
}

/** Carries the merchant/amount across the Pay route sequence
 * (/pay -> /confirm -> /processing -> /success | /failed). Mirrors
 * `useSendMoneyFlowStore`/`useFundWalletFlowStore` — deliberately NOT
 * persisted, same reasoning as those two. */
interface PayFlowState {
	values: PayFlowValues | null;
	setValues: (values: PayFlowValues) => void;
	reset: () => void;
}

const usePayFlowStore = create<PayFlowState>()((set) => ({
	values: null,
	setValues: (values) => set({ values }),
	reset: () => set({ values: null }),
}));

export { usePayFlowStore };
export type { PayFlowValues };
