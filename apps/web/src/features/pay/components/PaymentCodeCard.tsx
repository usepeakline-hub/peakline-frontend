"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

interface PaymentCodeCardProps {
	onLookup: (input: string) => void;
	loading: boolean;
	error: string | null;
}

/** Replaces the old fake QR-scan card — there's no real camera/QR-decoding
 * integration in this app (the old "Open camera to scan" button always
 * resolved to the same hardcoded merchant regardless of what was "scanned"),
 * and the real backend only offers `GET /pay/{code}` — a lookup by one
 * specific payment link's own code, not a generic "pay any merchant"
 * endpoint. A payer pastes the link (or just its code) they were sent
 * instead of scanning it. */
function PaymentCodeCard({ onLookup, loading, error }: PaymentCodeCardProps) {
	const [input, setInput] = useState("");

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!input.trim()) return;
		onLookup(input);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 sm:p-8"
		>
			<div className="flex flex-col gap-1">
				<h2 className="text-b2 font-semibold text-foreground sm:text-b1">
					Pay with a payment link
				</h2>
				<p className="text-c1 text-muted-foreground sm:text-b3">
					Paste the payment link or code a merchant shared with you
				</p>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="payment-code" className="text-label text-foreground">
					Payment link or code
				</label>
				<Input
					id="payment-code"
					placeholder="https://peakline.com/pay/... or code"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				{error && <p className="text-c1 text-destructive">{error}</p>}
			</div>

			<Button type="submit" size="large" className="w-full" loading={loading}>
				<Search className="size-4" aria-hidden="true" />
				Look Up Payment
			</Button>
		</form>
	);
}

export { PaymentCodeCard };
