import { z } from "zod";

export const profileSchema = z.object({
	username: z.string().trim().min(3, "Username must be at least 3 characters"),
	fullName: z.string().trim().min(1, "Enter your full name"),
	email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address"),
	phone: z.string().trim().min(1, "Enter your phone number"),
});
export type ProfileValues = z.infer<typeof profileSchema>;
