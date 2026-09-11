import { z } from "zod";

/**
 * `PATCH /users/me`'s own editable fields (`UpdateProfileFieldsDto`) —
 * email and phone number aren't in here at all; the API explicitly doesn't
 * accept changes to either through this endpoint ("those go through a
 * separate verified-change flow", not shipped yet), so `PersonalInformationCard`
 * shows them as permanently read-only rather than part of this form.
 */
export const profileSchema = z.object({
	firstName: z.string().trim().min(1, "Enter your first name"),
	lastName: z.string().trim().min(1, "Enter your last name"),
	otherName: z.string().trim().optional(),
	username: z
		.string()
		.trim()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username must be at most 30 characters")
		.regex(
			/^[a-z0-9_]+$/,
			"Lowercase letters, numbers, and underscores only",
		),
});
export type ProfileValues = z.infer<typeof profileSchema>;
