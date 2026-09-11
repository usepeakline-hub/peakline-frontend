"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Skeleton } from "@repo/ui/skeleton";
import { EmptyState } from "@repo/ui/empty-state";
import { toast } from "@repo/ui/sonner";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@repo/ui/form";
import { fundWalletSchema, type FundWalletValues } from "@/lib/validations/walletValidations";
import { useMyWallet, useCreateBusinessWallet } from "@/features/wallet/hooks";
import { useMyBusiness } from "@/features/business/hooks";
import { useAuthStore } from "@/lib/stores/authStore";
import { getApiErrorMessage } from "@/lib/api/errorMessage";
import { formatUsdc, usdcToGhs } from "@/lib/currency";

function SummaryRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-4 text-c1 sm:text-b3">
			<span className="text-muted-foreground">{label}</span>
			<span className="font-semibold text-foreground">{value}</span>
		</div>
	);
}

/**
 * A merchant's own wallet is their BUSINESS's wallet (see `useMyWallet`'s
 * own note) — not automatically provisioned, same "no way to add one" gap
 * Business Information itself had before its own empty-state fix. Shown in
 * place of the amount form until a business (and its wallet) exists.
 */
function MerchantWalletPrompt() {
	const { data: business, isLoading } = useMyBusiness();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-32 w-full rounded-2xl" />
			</div>
		);
	}

	if (!business) {
		return (
			<div className="rounded-2xl border border-border bg-background">
				<EmptyState
					icon={Wallet}
					title="No business yet"
					description="Add your business information before funding a wallet."
					action={
						<Button asChild size="large">
							<Link href="/account">Go to Account</Link>
						</Button>
					}
				/>
			</div>
		);
	}

	return <CreateBusinessWalletPrompt businessId={business.id} />;
}

function CreateBusinessWalletPrompt({ businessId }: { businessId: string }) {
	const createWallet = useCreateBusinessWallet(businessId);

	function handleCreate() {
		createWallet.mutate(undefined, {
			onError: (error) =>
				toast.error(getApiErrorMessage(error, "Couldn't create your business wallet")),
		});
	}

	return (
		<div className="rounded-2xl border border-border bg-background">
			<EmptyState
				icon={Wallet}
				title="No business wallet yet"
				description="Your business doesn't have a wallet yet — create one to start funding it."
				action={
					<Button
						type="button"
						size="large"
						loading={createWallet.isPending}
						onClick={handleCreate}
					>
						Create Business Wallet
					</Button>
				}
			/>
		</div>
	);
}

interface FundWalletFormStepProps {
	defaultValues?: FundWalletValues | null;
	onContinue: (values: FundWalletValues) => void;
}

/** Step 1 — an amount only now (no funding-method picker; the real backend
 * has no fiat on-ramp, so the earlier Mobile Money/Bank/Card picker was
 * fake from the start — see `walletValidations.ts`). Shared by the desktop
 * modal and the mobile /wallet/fund page. Gates on `useMyWallet` first: a
 * merchant with no business, or a business with no wallet yet, has nothing
 * to fund.
 */
function FundWalletFormStep({ defaultValues, onContinue }: FundWalletFormStepProps) {
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");
	const { data: wallet, isLoading: isLoadingWallet } = useMyWallet();
	const form = useForm<FundWalletValues>({
		resolver: zodResolver(fundWalletSchema),
		defaultValues: {
			amount: (defaultValues?.amount ?? "") as unknown as number,
		},
	});
	const amount = Number(form.watch("amount"));
	const amountValid = amount > 0 && !form.formState.errors.amount;

	if (isLoadingWallet) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-11 w-full" />
				<Skeleton className="h-11 w-full" />
			</div>
		);
	}

	if (!wallet) {
		if (isMerchant) return <MerchantWalletPrompt />;
		// Shouldn't normally happen — sign-up's own `SetPinForm` already
		// creates the individual's wallet — but the type allows it.
		return (
			<EmptyState
				icon={Wallet}
				title="No wallet yet"
				description="Your wallet hasn't been set up yet."
			/>
		);
	}

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
					<div className="flex flex-col gap-2.5 rounded-xl border border-secondary-300 bg-secondary-100 p-4 sm:gap-3 sm:p-5">
						<span className="text-c1 text-muted-foreground sm:text-b3">Summary</span>
						<SummaryRow label="Amount" value={`${formatUsdc(amount)} USDC`} />
						<SummaryRow label="Network" value="Stellar (testnet)" />
						<SummaryRow label="Source" value="Peakline test faucet" />
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
