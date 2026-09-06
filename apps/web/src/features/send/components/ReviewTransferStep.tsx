"use client";

import { Button } from "@repo/ui/button";
import { UserAvatar } from "@/features/dashboard/components/UserAvatar";
import {
	TRANSFER_METHODS,
	type SendMoneyValues,
} from "@/lib/validations/sendValidations";
import { formatUsdc, usdcToGhs } from "@/lib/currency";
import { FAKE_RECIPIENT_NAME } from "@/lib/send";

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
	onContinue: () => void;
}

/** Step 2 — mirrors `ConfirmFundingStep`'s shape (summary card + detail
 * card), with a recipient card in between since who the money is going to
 * matters more here than in a funding review. */
function ReviewTransferStep({ values, onContinue }: ReviewTransferStepProps) {
	const methodLabel =
		TRANSFER_METHODS.find((method) => method.value === values.method)?.label ??
		values.method;

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
					<UserAvatar
						name={FAKE_RECIPIENT_NAME}
						className="bg-primary-600 text-primary-foreground"
					/>
					<div className="flex flex-col">
						<span className="text-b3 font-semibold text-foreground sm:text-b2">
							{FAKE_RECIPIENT_NAME}
						</span>
						<span className="text-c1 text-muted-foreground sm:text-b3">
							{values.recipient}
						</span>
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

			<Button type="button" size="large" className="w-full" onClick={onContinue}>
				Continue
			</Button>
		</div>
	);
}

export { ReviewTransferStep };
