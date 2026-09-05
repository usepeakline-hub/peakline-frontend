import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TwoFactorMethod = "email" | "authenticator";

/**
 * Carries state across the Sign In -> 2FA method -> Verify sequence — every
 * login goes through 2FA, per the brief. Session-persisted like
 * `signUpFlowStore` (same rationale: survives a refresh mid-flow, gone once
 * the tab closes).
 */
interface LoginFlowState {
	email: string;
	setEmail: (email: string) => void;
	twoFactorMethod: TwoFactorMethod | null;
	setTwoFactorMethod: (method: TwoFactorMethod) => void;
	reset: () => void;
}

const useLoginFlowStore = create<LoginFlowState>()(
	persist(
		(set) => ({
			email: "",
			setEmail: (email) => set({ email }),
			twoFactorMethod: null,
			setTwoFactorMethod: (twoFactorMethod) => set({ twoFactorMethod }),
			reset: () => set({ email: "", twoFactorMethod: null }),
		}),
		{
			name: "peakline-login-flow",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

export { useLoginFlowStore };
