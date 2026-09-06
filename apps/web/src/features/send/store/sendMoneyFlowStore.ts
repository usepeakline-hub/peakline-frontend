import { create } from "zustand";
import type { SendMoneyValues } from "@/lib/validations/sendValidations";

/**
 * Carries the recipient/amount across the Send route sequence
 * (/send -> /review -> /processing -> /success | /failed). Mirrors
 * `fundWalletFlowStore` — deliberately NOT persisted, since this is a few
 * seconds of in-flight flow state, not something that should survive a hard
 * refresh mid-transfer.
 */
interface SendMoneyFlowState {
	values: SendMoneyValues | null;
	setValues: (values: SendMoneyValues) => void;
	reset: () => void;
}

const useSendMoneyFlowStore = create<SendMoneyFlowState>()((set) => ({
	values: null,
	setValues: (values) => set({ values }),
	reset: () => set({ values: null }),
}));

export { useSendMoneyFlowStore };
