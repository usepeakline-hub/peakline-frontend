"use client";

import { Button } from "@repo/ui/button";
import {
	FUNDING_METHODS,
	FUNDING_SOURCES,
	type FundWalletValues,
} from "@/lib/validations/walletValidations";
import { formatUsdc, usdcToGhs } from "@/lib/currency";

function DetailRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
	return (
		<div className="flex items-start justify-between gap-4 text-c1 sm:text-b3">
			<span className="text-muted-foreground">{label}</span>
			<span
				className={muted ? "text-muted-foreground" : "font-semibold text-foreground"}
			>
				{value}
			</span>
		</div>
	);
}

interface ConfirmFundingStepProps {
	values: FundWalletValues;
	onContinue: () => void;
}

/** Step 2 — a plain review of what's about to happen, no PIN (unlike the
 * onboarding transaction-PIN flow, this step's actual mock has none). */
function ConfirmFundingStep({ values, onContinue }: ConfirmFundingStepProps) {
	const methodLabel =
		FUNDING_METHODS.find((method) => method.value === values.fundingMethod)?.label ??
		values.fundingMethod;

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-1 rounded-xl border border-secondary-300 bg-secondary-100 p-4 sm:p-5">
				<span className="text-c1 text-muted-foreground sm:text-b3">You are funding</span>
				<span className="text-h5 text-foreground sm:text-h4">
					{formatUsdc(values.amount)} USDC
				</span>
				<span className="text-c1 text-muted-foreground sm:text-b3">
					~ GHS {formatUsdc(usdcToGhs(values.amount))}
				</span>
			</div>

			<div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:p-5">
				<DetailRow label="Funding Method" value={methodLabel} />
				<DetailRow
					label="From"
					value={
						FUNDING_SOURCES[values.fundingMethod as keyof typeof FUNDING_SOURCES] ??
						values.fundingMethod
					}
				/>
				<DetailRow label="Network" value="Stellar" />
				<DetailRow label="Est. Fee" value="0.00 USDC" muted />
				<DetailRow label="You will receive" value={`${formatUsdc(values.amount)} USDC`} />
			</div>

			<Button type="button" size="large" className="w-full" onClick={onContinue}>
				Continue
			</Button>
		</div>
	);
}

export { ConfirmFundingStep };
