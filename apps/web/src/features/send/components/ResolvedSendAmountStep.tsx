"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@repo/ui/form";
import { useWalletBalance } from "@/features/dashboard/hooks";
import { formatUsdc, usdcToGhs } from "@/lib/currency";
import type { SendMoneyValues } from "@/lib/validations/sendValidations";

const resolvedAmountSchema = z.object({
	amount: z.coerce
		.number({ message: "Enter an amount" })
		.positive("Enter an amount greater than 0"),
	note: z.string().trim().max(140, "Note is too long").optional(),
});
type ResolvedAmountValues = z.infer<typeof resolvedAmountSchema>;

interface ResolvedSendAmountStepProps {
	recipientAddress: string;
	recipientName?: string;
	onContinue: (values: SendMoneyValues) => void;
}

/**
 * The QR/link-arrival version of Step 1 — reported live: unlike the
 * regular Send form (which has to ask *how* to identify a recipient at
 * all), a Receive QR/link already resolved exactly who's being paid
 * (`ResolvedRecipientCard`, shown alongside this), so there's nothing left
 * to pick — just the amount. No method selector, no recipient field to
 * double-check or accidentally edit; `method`/`recipient` are fixed
 * internally from the resolved address `SendMoneyPage` already looked up,
 * same as `SendMoneyFormStep`'s own `method: "wallet"` path, just without
 * exposing the choice.
 */
function ResolvedSendAmountStep({
	recipientAddress,
	recipientName,
	onContinue,
}: ResolvedSendAmountStepProps) {
	const { data: balance } = useWalletBalance();
	const form = useForm<ResolvedAmountValues>({
		resolver: zodResolver(resolvedAmountSchema),
		defaultValues: { amount: "" as unknown as number, note: "" },
	});
	const amount = Number(form.watch("amount"));
	const amountValid = amount > 0 && !form.formState.errors.amount;

	function handleSubmit(values: ResolvedAmountValues) {
		if (balance && values.amount > balance.amount) {
			form.setError("amount", { message: "Insufficient balance" });
			return;
		}
		onContinue({
			method: "wallet",
			recipient: recipientAddress,
			recipientName,
			amount: values.amount,
			note: values.note,
		});
	}

	return (
		<Form {...form}>
			<form
				noValidate
				onSubmit={form.handleSubmit(handleSubmit)}
				className="flex flex-col gap-5"
			>
				<FormField
					control={form.control}
					name="amount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<div className="flex gap-3">
								<FormControl>
									<Input
										type="number"
										inputMode="decimal"
										min={0}
										step="any"
										placeholder="0"
										autoFocus
										{...field}
									/>
								</FormControl>
								<div className="flex h-11 w-24 shrink-0 items-center justify-center rounded-lg border border-input bg-muted text-b1 text-foreground">
									USDC
								</div>
							</div>
							{amountValid && (
								<p className="text-c1 text-muted-foreground">
									~ GHS {formatUsdc(usdcToGhs(amount))}
								</p>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				{balance && (
					<div className="flex items-center justify-between text-c1 sm:text-b3">
						<span className="text-muted-foreground">Available Balance</span>
						<span className="font-semibold text-foreground">
							{formatUsdc(balance.amount)} {balance.currency}
						</span>
					</div>
				)}

				<FormField
					control={form.control}
					name="note"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Note (optional)</FormLabel>
							<FormControl>
								<Input placeholder="Add note" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" size="large" className="w-full">
					Continue
				</Button>
			</form>
		</Form>
	);
}

export { ResolvedSendAmountStep };
