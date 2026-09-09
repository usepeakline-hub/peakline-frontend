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
	createPaymentLinkSchema,
	type CreatePaymentLinkValues,
} from "@/lib/validations/paymentLinksValidations";
import { useCreatePaymentLink } from "@/features/merchant/hooks";
import { formatUsdc, usdcToGhs } from "@/lib/currency";

interface CreatePaymentLinkFormProps {
	onCreated: (link: string) => void;
}

/**
 * Merchant's own take on `RequestPaymentForm` — same amount/description/
 * reference shape, plus a "Payment Title" up top (the mock's own reason
 * this exists as a separate feature rather than just reusing that form
 * outright). The mock's own screen showed "Description (optional)" twice
 * in a row — kept to one field, since a form asking the same optional
 * question twice reads as a mock duplication bug, not a deliberate design.
 */
function CreatePaymentLinkForm({ onCreated }: CreatePaymentLinkFormProps) {
	const createLink = useCreatePaymentLink();
	const form = useForm<CreatePaymentLinkValues>({
		resolver: zodResolver(createPaymentLinkSchema),
		defaultValues: {
			title: "",
			amount: "" as unknown as number,
			description: "",
			reference: "",
		},
	});
	const amount = Number(form.watch("amount"));
	const amountValid = amount > 0 && !form.formState.errors.amount;

	function handleSubmit(values: CreatePaymentLinkValues) {
		createLink.mutate(values, {
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
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Payment Title</FormLabel>
							<FormControl>
								<Input placeholder="Enter title" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

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

				<Button type="submit" size="large" className="w-full" loading={createLink.isPending}>
					Create Link
				</Button>
			</form>
		</Form>
	);
}

export { CreatePaymentLinkForm };
