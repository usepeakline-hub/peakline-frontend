import { create } from "zustand";
import type { FundWalletValues } from "@/lib/validations/walletValidations";

/**
 * Carries the amount/method across the mobile Fund Wallet route sequence
 * (/wallet/fund -> /confirm -> /processing -> /success | /failed) — the
 * desktop modal doesn't need this, it just keeps the same values in local
 * state since it never unmounts between steps. Deliberately NOT persisted:
 * this is a few seconds of in-flight flow state, not something that should
 * survive a hard refresh (imagine re-confirming a stale amount after
 * refreshing mid-flow).
 */
interface FundWalletFlowState {
	values: FundWalletValues | null;
	setValues: (values: FundWalletValues) => void;
	reset: () => void;
}

const useFundWalletFlowStore = create<FundWalletFlowState>()((set) => ({
	values: null,
	setValues: (values) => set({ values }),
	reset: () => set({ values: null }),
}));

export { useFundWalletFlowStore };
