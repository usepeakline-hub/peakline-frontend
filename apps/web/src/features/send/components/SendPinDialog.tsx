"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { OtpInput } from "@repo/ui/otp-input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@repo/ui/dialog";

const PIN_LENGTH = 6;

interface SendPinDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: (pin: string) => void;
}

/**
 * The transaction-PIN step, pulled out of the Review page itself into its
 * own modal (desktop) / bottom-sheet drawer (mobile) — same
 * `DialogContent mobileSheet` pattern `ChangePinDialog` already uses.
 * Previously an inline `OtpInput` at the bottom of the review screen;
 * separating it out keeps Review a pure summary and makes "authorize this
 * specific transfer" its own explicit, focused step, fully controlled
 * (opened by `ReviewTransferStep`'s own "Send" button) rather than a
 * `DialogTrigger`.
 */
function SendPinDialog({ open, onOpenChange, onConfirm }: SendPinDialogProps) {
	const [pin, setPin] = useState("");
	const pinComplete = pin.length === PIN_LENGTH;

	function handleOpenChange(next: boolean) {
		onOpenChange(next);
		if (!next) setPin("");
	}

	function handleSubmit() {
		if (!pinComplete) return;
		onConfirm(pin);
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent mobileSheet>
				<DialogHeader>
					<DialogTitle>Enter your PIN</DialogTitle>
					<DialogDescription>Confirm this transfer with your transaction PIN.</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-5">
					<OtpInput value={pin} onChange={setPin} length={PIN_LENGTH} />
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
			</DialogContent>
		</Dialog>
	);
}

export { SendPinDialog };
