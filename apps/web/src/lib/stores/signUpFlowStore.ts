import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AccountTypeValues } from "@/lib/validations/authValidations";

/**
 * Transient state carried across the multi-step sign-up flow (Sign Up ->
 * Account Type -> [Merchant Setup, merchant only] -> Verify -> Personal
 * Details -> Wallet Created). Session-scoped (not localStorage) — this
 * shouldn't outlive the browser tab, and shouldn't leak into a URL either.
 */
interface SignUpFlowState {
	/** Set at Sign Up — Verify checks the code against this. */
	email: string;
	setEmail: (email: string) => void;
	phone: string;
	setPhone: (phone: string) => void;
	/** Personal vs Merchant, chosen on the Account Type step — decides which
	 * app (dashboard vs merchant) the user eventually lands in once those
	 * exist. Unset until that step completes. */
	accountType: AccountTypeValues["accountType"] | null;
	setAccountType: (accountType: AccountTypeValues["accountType"]) => void;
	reset: () => void;
}

const useSignUpFlowStore = create<SignUpFlowState>()(
	persist(
		(set) => ({
			email: "",
			setEmail: (email) => set({ email }),
			phone: "",
			setPhone: (phone) => set({ phone }),
			accountType: null,
			setAccountType: (accountType) => set({ accountType }),
			reset: () => set({ email: "", phone: "", accountType: null }),
		}),
		{
			name: "peakline-sign-up-flow",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

export { useSignUpFlowStore };
