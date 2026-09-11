"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { PhoneInput } from "@repo/ui/phone-input";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@repo/ui/form";
import {
	sendMoneySchema,
	TRANSFER_METHODS,
	type SendMoneyValues,
} from "@/lib/validations/sendValidations";
import { useWalletBalance } from "@/features/dashboard/hooks";
import { formatUsdc, usdcToGhs } from "@/lib/currency";

const RECIPIENT_FIELD: Record<
	SendMoneyValues["method"],
	{ label: string; placeholder: string }
> = {
	phone: { label: "Recipient Phone Number", placeholder: "" },
	username: { label: "Recipient Username", placeholder: "Enter username" },
	wallet: {
		label: "Recipient Wallet Address",
		placeholder: "Enter wallet address",
	},
};

interface SendMoneyFormStepProps {
	defaultValues?: SendMoneyValues | null;
	onContinue: (values: SendMoneyValues) => void;
}

/** Step 1 — transfer method + the single matching recipient field, amount,
 * and an optional note. The reference mock's screenshot shows all three
 * recipient fields (Phone/Username/Wallet Address) stacked at once, which
 * reads as its unselected "kitchen sink" reference state rather than actual
 * runtime behavior — showing only the field for the chosen method is both
 * cleaner and avoids validating two empty fields no one is filling in. */
function SendMoneyFormStep({ defaultValues, onContinue }: SendMoneyFormStepProps) {
	const { data: balance } = useWalletBalance();
	const form = useForm<SendMoneyValues>({
		resolver: zodResolver(sendMoneySchema),
		defaultValues: {
			method: defaultValues?.method ?? (undefined as unknown as SendMoneyValues["method"]),
			recipient: defaultValues?.recipient ?? "",
			amount: (defaultValues?.amount ?? "") as unknown as number,
			note: defaultValues?.note ?? "",
		},
	});
	const method = form.watch("method");
	const amount = Number(form.watch("amount"));
	const amountValid = amount > 0 && !form.formState.errors.amount;

	function handleSubmit(values: SendMoneyValues) {
		if (balance && values.amount > balance.amount) {
			form.setError("amount", { message: "Insufficient balance" });
			return;
		}
		onContinue(values);
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
					name="method"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Select Transfer Method</FormLabel>
							<FormControl>
								<Select
									{...field}
									value={field.value ?? ""}
									onChange={(e) => {
										field.onChange(e);
										// Switching methods invalidates whatever was typed
										// for the previous one.
										form.resetField("recipient", { defaultValue: "" });
									}}
								>
									<option value="" disabled>
										Phone, username, wallet address
									</option>
									{TRANSFER_METHODS.map((transferMethod) => (
										<option key={transferMethod.value} value={transferMethod.value}>
											{transferMethod.label}
										</option>
									))}
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{method && (
					<FormField
						control={form.control}
						name="recipient"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{RECIPIENT_FIELD[method].label}</FormLabel>
								<FormControl>
									{method === "phone" ? (
										<PhoneInput
											name={field.name}
											value={field.value}
											onChange={field.onChange}
											onBlur={field.onBlur}
										/>
									) : (
										<Input placeholder={RECIPIENT_FIELD[method].placeholder} {...field} />
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

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

export { SendMoneyFormStep };
