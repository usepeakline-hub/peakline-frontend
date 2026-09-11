"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import { Button } from "@repo/ui/button";
import { OtpInput } from "@repo/ui/otp-input";
import {
	TRANSFER_METHODS,
	type SendMoneyValues,
} from "@/lib/validations/sendValidations";
import { formatUsdc, usdcToGhs } from "@/lib/currency";

const PIN_LENGTH = 6;

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

interface ReviewTransferStepProps {
	values: SendMoneyValues;
	onContinue: (pin: string) => void;
}

/** Step 2 — mirrors `ConfirmFundingStep`'s shape (summary card + detail
 * card), plus a PIN entry at the bottom (same combined review+authorize
 * pattern as Pay's own `ConfirmPaymentStep` — a real send requires the
 * transaction PIN on every call). There's no "resolve this identifier to a
 * name" endpoint, so unlike an earlier version of this screen, the "To" row
 * shows the identifier as typed rather than a fabricated recipient name —
 * the real name/label (`recipientLabel`) only comes back once the transfer
 * actually completes (see `TransferSuccessStep`). */
function ReviewTransferStep({ values, onContinue }: ReviewTransferStepProps) {
	const [pin, setPin] = useState("");
	const pinComplete = pin.length === PIN_LENGTH;
	const methodLabel =
		TRANSFER_METHODS.find((method) => method.value === values.method)?.label ??
		values.method;

	function handleSubmit() {
		if (!pinComplete) return;
		onContinue(pin);
	}

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-1 rounded-xl border border-secondary-300 bg-secondary-100 p-4 sm:p-5">
				<span className="text-c1 text-muted-foreground sm:text-b3">You are sending</span>
				<span className="text-h5 text-foreground sm:text-h4">
					{formatUsdc(values.amount)} USDC
				</span>
				<span className="text-c1 text-muted-foreground sm:text-b3">
					~ GHS {formatUsdc(usdcToGhs(values.amount))}
				</span>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-c1 text-muted-foreground sm:text-b3">To</span>
				<div className="flex items-center gap-3 rounded-xl border border-border p-4 sm:p-5">
					<span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
						<UserRound className="size-5" aria-hidden="true" />
					</span>
					<div className="flex min-w-0 flex-col">
						<span className="truncate text-b3 font-semibold text-foreground sm:text-b2">
							{values.recipient}
						</span>
						<span className="text-c1 text-muted-foreground sm:text-b3">{methodLabel}</span>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:p-5">
				<DetailRow label="Transfer Method" value={methodLabel} />
				<DetailRow label="Network" value="Stellar" />
				<DetailRow label="Est. Fee" value="0.00 USDC" muted />
				{values.note && <DetailRow label="Note" value={values.note} muted />}
				<DetailRow label="Total" value={`${formatUsdc(values.amount)} USDC`} />
			</div>

			<div className="flex flex-col gap-3">
				<span className="text-c1 text-muted-foreground sm:text-b3">
					Enter your PIN to confirm
				</span>
				<OtpInput value={pin} onChange={setPin} length={PIN_LENGTH} />
			</div>

			<Button
				type="button"
				size="large"
				className="w-full"
				disabled={!pinComplete}
				onClick={handleSubmit}
			>
				Send
			</Button>
		</div>
	);
}

export { ReviewTransferStep };
