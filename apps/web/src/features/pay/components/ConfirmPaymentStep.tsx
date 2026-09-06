"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { OtpInput } from "@repo/ui/otp-input";
import { MerchantAvatar } from "@/features/pay/components/MerchantAvatar";
import { formatUsdc, usdcToGhs } from "@/lib/currency";
import type { PayFlowValues } from "@/features/pay/store/payFlowStore";

const PIN_LENGTH = 6;

interface ConfirmPaymentStepProps {
	values: PayFlowValues;
	onContinue: () => void;
}

/**
 * The mock's confirm step shows a numeric entry right below a fixed
 * "You are sending" summary — read as the transaction PIN from onboarding
 * (`SetPinForm`) finally getting used, not amount entry: the summary
 * amount is fixed text, not an editable field, and re-typing an
 * already-chosen amount wouldn't make sense. Uses the same `OtpInput` as
 * `SetPinForm` — real inputs, so the device's own numeric keyboard shows
 * up, rather than an on-screen keypad standing in for it. No backend to
 * actually validate a PIN against yet, so any 6 digits proceeds — same
 * spirit as every other `fakeRequest` in the app.
 */
function ConfirmPaymentStep({ values, onContinue }: ConfirmPaymentStepProps) {
	const [pin, setPin] = useState("");
	const pinComplete = pin.length === PIN_LENGTH;

	function handleSubmit() {
		if (!pinComplete) return;
		onContinue();
	}

	return (
		<div className="flex flex-col gap-6 rounded-2xl border border-secondary-300 bg-secondary-100 p-6 sm:p-8">
			<div className="flex flex-col gap-1">
				<span className="text-c1 text-muted-foreground sm:text-b3">You are sending</span>
				<span className="text-h5 text-foreground sm:text-h4">
					{formatUsdc(values.amount)} USDC
				</span>
				<span className="text-c1 text-muted-foreground sm:text-b3">
					~ GHS {formatUsdc(usdcToGhs(values.amount))}
				</span>
			</div>

			<div className="flex items-center gap-3">
				<MerchantAvatar name={values.merchant.name} className="size-11 text-b1 sm:size-12" />
				<div className="flex flex-col">
					<span className="text-b3 font-semibold text-foreground sm:text-b2">
						{values.merchant.name}
					</span>
					<span className="text-c1 text-muted-foreground sm:text-b3">Merchant</span>
				</div>
			</div>

			<OtpInput value={pin} onChange={setPin} length={PIN_LENGTH} />

			<Button
				type="button"
				size="large"
				className="w-full"
				disabled={!pinComplete}
				onClick={handleSubmit}
			>
				Pay
			</Button>
		</div>
	);
}

export { ConfirmPaymentStep };
