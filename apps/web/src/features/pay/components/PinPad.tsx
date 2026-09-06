"use client";

import { Delete } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "backspace"];

interface PinPadProps {
	value: string;
	onChange: (value: string) => void;
	length?: number;
}

/**
 * Numeric keypad + progress dots for the transaction PIN, per the mock's
 * confirm step. The mock's own screenshot didn't show a dot row, but a PIN
 * pad with zero progress feedback is unusable — added as the obvious,
 * low-risk completion rather than an omission worth leaving in.
 */
function PinPad({ value, onChange, length = 6 }: PinPadProps) {
	function handleKey(key: string) {
		if (key === "backspace") {
			onChange(value.slice(0, -1));
		} else if (key && value.length < length) {
			onChange(value + key);
		}
	}

	return (
		<div className="flex w-full flex-col items-center gap-6">
			<div className="flex justify-center gap-3">
				{Array.from({ length }, (_, i) => (
					<span
						key={i}
						className={cn(
							"size-3 rounded-full border border-border",
							i < value.length && "border-primary-500 bg-primary-500",
						)}
					/>
				))}
			</div>

			<div className="grid w-full grid-cols-3 gap-3">
				{KEYS.map((key, i) =>
					key === "" ? (
						<div key={i} aria-hidden="true" />
					) : (
						<button
							key={i}
							type="button"
							onClick={() => handleKey(key)}
							aria-label={key === "backspace" ? "Delete digit" : `Digit ${key}`}
							className="flex h-14 items-center justify-center rounded-xl border border-border bg-background text-h5 font-medium text-foreground transition-colors hover:bg-muted"
						>
							{key === "backspace" ? (
								<Delete className="size-5" aria-hidden="true" />
							) : (
								key
							)}
						</button>
					),
				)}
			</div>
		</div>
	);
}

export { PinPad };
