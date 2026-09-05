import { create } from "zustand";
import type {
	PersonalDetailsValues,
	IdVerificationValues,
} from "@/lib/validations/authValidations";

/**
 * Carries data across the Personal Information -> ID Verification -> Review
 * sub-flow. Deliberately NOT persisted (unlike `signUpFlowStore`): ID
 * Verification holds `File` objects, which can't survive a JSON-serialized
 * sessionStorage round trip. This is a plain in-memory store instead — it
 * survives client-side navigation between the three steps, and is expected
 * to reset on a hard refresh, same as any other file input would.
 */
interface PersonalInfoFlowState {
	personalDetails: PersonalDetailsValues | null;
	setPersonalDetails: (values: PersonalDetailsValues) => void;
	idVerification: IdVerificationValues | null;
	setIdVerification: (values: IdVerificationValues) => void;
	reset: () => void;
}

const usePersonalInfoFlowStore = create<PersonalInfoFlowState>()((set) => ({
	personalDetails: null,
	setPersonalDetails: (personalDetails) => set({ personalDetails }),
	idVerification: null,
	setIdVerification: (idVerification) => set({ idVerification }),
	reset: () => set({ personalDetails: null, idVerification: null }),
}));

export { usePersonalInfoFlowStore };
