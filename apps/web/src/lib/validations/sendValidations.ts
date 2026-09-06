import { z } from "zod";

export const TRANSFER_METHODS = [
	{ value: "phone", label: "Phone Number" },
	{ value: "username", label: "Username" },
	{ value: "wallet_address", label: "Wallet Address" },
] as const;

// Same shape as the fake Stellar public key in `@/lib/wallet` — "G" + 55
// base32 chars, 56 total.
const WALLET_ADDRESS_REGEX = /^G[A-Z2-7]{55}$/;

export const sendMoneySchema = z
	.object({
		method: z.enum(
			TRANSFER_METHODS.map((method) => method.value) as [string, ...string[]],
			{ message: "Select a transfer method" },
		),
		// One combined field for whichever recipient identifier the chosen
		// method needs — validated per-method below rather than carrying three
		// separate (mostly-empty) fields.
		recipient: z.string().trim().min(1, "Enter recipient details"),
		amount: z.coerce
			.number({ message: "Enter an amount" })
			.positive("Enter an amount greater than 0"),
		note: z.string().trim().max(140, "Note is too long").optional(),
	})
	.superRefine((data, ctx) => {
		if (data.method === "phone") {
			const digits = data.recipient.replace(/\D/g, "");
			if (digits.length < 9) {
				ctx.addIssue({
					code: "custom",
					path: ["recipient"],
					message: "Enter a valid phone number",
				});
			}
		} else if (data.method === "username") {
			if (data.recipient.length < 3) {
				ctx.addIssue({
					code: "custom",
					path: ["recipient"],
					message: "Enter a valid username",
				});
			}
		} else if (data.method === "wallet_address") {
			if (!WALLET_ADDRESS_REGEX.test(data.recipient)) {
				ctx.addIssue({
					code: "custom",
					path: ["recipient"],
					message: "Enter a valid Stellar wallet address",
				});
			}
		}
	});
export type SendMoneyValues = z.infer<typeof sendMoneySchema>;
