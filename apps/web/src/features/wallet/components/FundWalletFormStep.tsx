"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@repo/ui/form";
import {
	fundWalletSchema,
	FUNDING_METHODS,
	type FundWalletValues,
} from "@/lib/validations/walletValidations";
import { formatUsdc, usdcToGhs } from "@/lib/currency";

function SummaryRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-4 text-c1 sm:text-b3">
			<span className="text-muted-foreground">{label}</span>
			<span className="font-semibold text-foreground">{value}</span>
		</div>
	);
}

interface FundWalletFormStepProps {
	defaultValues?: FundWalletValues | null;
	onContinue: (values: FundWalletValues) => void;
}

/** Step 1 — amount + funding method, with a live GHS estimate and summary
 * preview once the amount is valid. Shared by the desktop modal and the
 * mobile /wallet/fund page. */
function FundWalletFormStep({ defaultValues, onContinue }: FundWalletFormStepProps) {
	const form = useForm<FundWalletValues>({
		resolver: zodResolver(fundWalletSchema),
		defaultValues: {
			amount: (defaultValues?.amount ?? "") as unknown as number,
			fundingMethod:
				defaultValues?.fundingMethod ??
				(undefined as unknown as FundWalletValues["fundingMethod"]),
		},
	});
	const amount = Number(form.watch("amount"));
	const amountValid = amount > 0 && !form.formState.errors.amount;

	return (
		<Form {...form}>
			<form
				noValidate
				onSubmit={form.handleSubmit(onContinue)}
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

				{amountValid && (
					<SummaryRow label="You will receive" value={`${formatUsdc(amount)} USDC`} />
				)}

				<FormField
					control={form.control}
					name="fundingMethod"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Funding Method</FormLabel>
							<FormControl>
								<Select {...field} value={field.value ?? ""}>
									<option value="" disabled>
										Select funding method
									</option>
									{FUNDING_METHODS.map((method) => (
										<option key={method.value} value={method.value}>
											{method.label}
										</option>
									))}
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{amountValid && (
					<div className="flex flex-col gap-2.5 rounded-xl border border-secondary-300 bg-secondary-100 p-4 sm:gap-3 sm:p-5">
						<span className="text-c1 text-muted-foreground sm:text-b3">Summary</span>
						<SummaryRow label="Amount" value={`${formatUsdc(amount)} USDC`} />
						<SummaryRow label="You will receive" value={`${formatUsdc(amount)} USDC`} />
						<SummaryRow label="Network" value="Stellar" />
						<SummaryRow label="Est. Fee" value="0.00 USDC" />
					</div>
				)}

				<Button type="submit" size="large" className="w-full">
					Continue
				</Button>
			</form>
		</Form>
	);
}

export { FundWalletFormStep };
