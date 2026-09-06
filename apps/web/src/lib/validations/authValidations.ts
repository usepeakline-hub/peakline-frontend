import { z } from "zod";

/**
 * Ghana mobile numbers are 9 digits after the +233 country code, and start
 * with 2 or 5 (MTN/Vodafone/AirtelTigo/Glo all fall under those two leading
 * digits). `PhoneInput` (@repo/ui) already normalizes what it hands back —
 * digits only, no leading trunk 0, capped at 9 — so this just confirms the
 * shape landed correctly rather than reparsing free text.
 */
export const GHANA_PHONE_REGEX = /^\+233 [25]\d{8}$/;

export const signInSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Enter your email address")
		.email("Enter a valid email address"),
	password: z.string().min(1, "Enter your password"),
});
export type SignInValues = z.infer<typeof signInSchema>;

/** Every login goes through 2FA — Sign In -> pick a method -> Verify. */
export const twoFactorMethodSchema = z.object({
	method: z.enum(["email", "authenticator"], {
		message: "Choose a verification method",
	}),
});
export type TwoFactorMethodValues = z.infer<typeof twoFactorMethodSchema>;

/**
 * One rule per requirement (rather than one combined regex) so a live
 * checklist UI can point at exactly which ones are unmet — see
 * `PASSWORD_RULES` and its use in `SignUpForm`.
 */
export const PASSWORD_RULES = [
	{ key: "length", label: "At least 8 characters", test: (v: string) => v.length >= 8 },
	{ key: "lowercase", label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
	{ key: "uppercase", label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
	{ key: "number", label: "One number", test: (v: string) => /[0-9]/.test(v) },
	{ key: "symbol", label: "One symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

export const signUpSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Enter your email address")
		.email("Enter a valid email address"),
	phone: z
		.string()
		.trim()
		.min(1, "Enter your phone number")
		.regex(GHANA_PHONE_REGEX, "Enter a valid Ghana phone number"),
	password: z
		.string()
		.min(1, "Enter a password")
		.refine(
			(value) => PASSWORD_RULES.every((rule) => rule.test(value)),
			"Your password doesn't meet all the requirements below",
		),
	agreeToTerms: z.boolean().refine((value) => value === true, {
		message: "You must agree to the Terms of Service and Privacy Policy",
	}),
});
export type SignUpValues = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Enter your email address")
		.email("Enter a valid email address"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, "Enter a password")
			.refine(
				(value) => PASSWORD_RULES.every((rule) => rule.test(value)),
				"Your password doesn't meet all the requirements below",
			),
		confirmPassword: z.string().min(1, "Confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const accountTypeSchema = z.object({
	accountType: z.enum(["personal", "merchant"], {
		message: "Choose how you'll use Peakline",
	}),
});
export type AccountTypeValues = z.infer<typeof accountTypeSchema>;

export const merchantSetupSchema = z.object({
	businessName: z.string().trim().min(1, "Enter your business name"),
	businessCategory: z.string().trim().min(1, "Enter your business category"),
	phone: z
		.string()
		.trim()
		.min(1, "Enter your phone number")
		.regex(GHANA_PHONE_REGEX, "Enter a valid Ghana phone number"),
	businessLocation: z.string().trim().min(1, "Enter your business location"),
});
export type MerchantSetupValues = z.infer<typeof merchantSetupSchema>;

export const verifyOtpSchema = z.object({
	code: z.string().length(6, "Enter the full 6-digit code"),
});
export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;

/**
 * Step 1 (Personal Information) of the post-verification profile flow —
 * Personal Information -> ID Verification -> Review. No name field here on
 * purpose: neither this step nor Sign Up asks for one in the current Figma,
 * so it's presumably meant to come off the ID document in step 2.
 */
export const personalDetailsSchema = z.object({
	dateOfBirth: z.string().min(1, "Enter your date of birth"),
	nationality: z.string().trim().min(1, "Enter your nationality"),
	residentialAddress: z
		.string()
		.trim()
		.min(1, "Enter your residential address"),
	city: z.string().trim().min(1, "Enter your city"),
});
export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;

export const DOCUMENT_TYPES = [
	{ value: "ghana_card", label: "Ghana Card" },
	{ value: "passport", label: "Passport" },
	{ value: "voters_id", label: "Voter's ID" },
	{ value: "drivers_license", label: "Driver's License" },
] as const;

/** Passport is a single data page; the other three are two-sided cards. */
const TWO_SIDED_DOCUMENT_TYPES = new Set(["ghana_card", "voters_id", "drivers_license"]);

/**
 * Step 2 (ID Verification) of the post-verification profile flow. Files
 * can't survive a JSON-serialized sessionStorage round trip, so this (and
 * `personalDetailsSchema`) is held in the in-memory-only
 * `usePersonalInfoFlowStore`, not the session-persisted `signUpFlowStore`.
 */
export const idVerificationSchema = z
	.object({
		documentType: z.enum(
			DOCUMENT_TYPES.map((type) => type.value) as [string, ...string[]],
			{ message: "Select a document type" },
		),
		documentNumber: z.string().trim().min(1, "Enter your document number"),
		documentFront: z.custom<File>((value) => value instanceof File, {
			message: "Upload the front of your document",
		}),
		documentBack: z.custom<File>((value) => value instanceof File).optional(),
	})
	.superRefine((data, ctx) => {
		if (
			TWO_SIDED_DOCUMENT_TYPES.has(data.documentType) &&
			!(data.documentBack instanceof File)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["documentBack"],
				message: "Upload the back of your document",
			});
		}
	});
export type IdVerificationValues = z.infer<typeof idVerificationSchema>;

export const setPinSchema = z
	.object({
		pin: z.string().regex(/^\d{6}$/, "Enter a 6-digit PIN"),
		confirmPin: z.string().regex(/^\d{6}$/, "Re-enter your 6-digit PIN"),
	})
	.refine((data) => data.pin === data.confirmPin, {
		message: "PINs don't match",
		path: ["confirmPin"],
	});
export type SetPinValues = z.infer<typeof setPinSchema>;
