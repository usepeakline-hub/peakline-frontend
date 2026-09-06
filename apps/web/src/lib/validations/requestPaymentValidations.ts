import { z } from "zod";

export const requestPaymentSchema = z.object({
	amount: z.coerce
		.number({ message: "Enter an amount" })
		.positive("Enter an amount greater than 0"),
	description: z.string().trim().max(140, "Description is too long").optional(),
	reference: z.string().trim().max(60, "Reference is too long").optional(),
});
export type RequestPaymentValues = z.infer<typeof requestPaymentSchema>;
