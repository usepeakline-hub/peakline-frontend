import { z } from "zod";

export const FUNDING_METHODS = [
	{ value: "mobile_money", label: "Mobile Money" },
	{ value: "bank_transfer", label: "Bank Transfer" },
	{ value: "card", label: "Debit/Credit Card" },
] as const;

/** The linked source shown on the Confirm step's "From" row — fake/static,
 * standing in for whatever a real account-linking flow would produce. */
export const FUNDING_SOURCES: Record<
	(typeof FUNDING_METHODS)[number]["value"],
	string
> = {
	mobile_money: "MTN Mobile Money ******5678",
	bank_transfer: "Ghana Commercial Bank ******1234",
	card: "Visa ****4242",
};

const MIN_FUNDING_AMOUNT = 10;

export const fundWalletSchema = z.object({
	amount: z.coerce
		.number({ message: "Enter an amount" })
		.positive("Enter an amount greater than 0")
		.min(
			MIN_FUNDING_AMOUNT,
			`Minimum funding amount is ${MIN_FUNDING_AMOUNT} USDC`,
		),
	fundingMethod: z.enum(
		FUNDING_METHODS.map((method) => method.value) as [string, ...string[]],
		{ message: "Select a funding method" },
	),
});
export type FundWalletValues = z.infer<typeof fundWalletSchema>;
