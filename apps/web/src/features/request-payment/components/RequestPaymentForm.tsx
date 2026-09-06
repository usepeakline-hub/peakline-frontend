"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@repo/ui/form";
import {
	requestPaymentSchema,
	type RequestPaymentValues,
} from "@/lib/validations/requestPaymentValidations";
import { useCreatePaymentRequest } from "@/features/request-payment/hooks";
import { formatUsdc, usdcToGhs } from "@/lib/currency";

interface RequestPaymentFormProps {
	onCreated: (link: string) => void;
}

/** Step 1 — amount + optional description/reference, matching the mock.
 * Left empty by default (not pre-filled with "1000" like the mock's own
 * screenshot) — same convention as every other amount field in the app
 * (Send, Fund Wallet, Pay). */
function RequestPaymentForm({ onCreated }: RequestPaymentFormProps) {
	const createRequest = useCreatePaymentRequest();
	const form = useForm<RequestPaymentValues>({
		resolver: zodResolver(requestPaymentSchema),
		defaultValues: {
			amount: "" as unknown as number,
			description: "",
			reference: "",
		},
	});
	const amount = Number(form.watch("amount"));
	const amountValid = amount > 0 && !form.formState.errors.amount;

	function handleSubmit(values: RequestPaymentValues) {
		createRequest.mutate(values, {
			onSuccess: (result) => onCreated(result.link),
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

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description (optional)</FormLabel>
							<FormControl>
								<Input placeholder="Add note" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="reference"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Customer reference (optional)</FormLabel>
							<FormControl>
								<Input placeholder="e.g INV-001" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" size="large" className="w-full" loading={createRequest.isPending}>
					Create Request
				</Button>
			</form>
		</Form>
	);
}

export { RequestPaymentForm };
