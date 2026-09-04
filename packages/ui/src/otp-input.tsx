"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

import { cn } from "./lib/utils";

interface OtpInputProps {
	length?: number;
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	"aria-invalid"?: boolean;
}

/** A row of single-digit boxes for verification codes — auto-advances, handles backspace and paste. */
function OtpInput({
	length = 6,
	value,
	onChange,
	disabled,
	"aria-invalid": ariaInvalid,
}: OtpInputProps) {
	const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
	const digits = Array.from({ length }, (_, i) => value[i] ?? "");

	function setDigit(index: number, digit: string) {
		const next = digits.slice();
		next[index] = digit;
		onChange(next.join(""));
	}

	function handleChange(index: number, raw: string) {
		const digit = raw.replace(/\D/g, "").slice(-1);
		setDigit(index, digit);
		if (digit && index < length - 1) {
			inputsRef.current[index + 1]?.focus();
		}
	}

	function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Backspace" && !digits[index] && index > 0) {
			inputsRef.current[index - 1]?.focus();
		}
	}

	function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
		const pasted = e.clipboardData
			.getData("text")
			.replace(/\D/g, "")
			.slice(0, length);
		if (!pasted) return;
		e.preventDefault();
		onChange(pasted);
		inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
	}

	return (
		<div
			className="flex justify-between gap-2"
			role="group"
			aria-label="Verification code"
		>
			{digits.map((digit, index) => (
				<input
					key={index}
					ref={(el) => {
						inputsRef.current[index] = el;
					}}
					type="text"
					inputMode="numeric"
					autoComplete={index === 0 ? "one-time-code" : "off"}
					maxLength={1}
					value={digit}
					disabled={disabled}
					onChange={(e) => handleChange(index, e.target.value)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					onPaste={handlePaste}
					aria-invalid={ariaInvalid}
					className={cn(
						"h-14 w-12 rounded-lg border border-input bg-background text-center text-h4 text-foreground shadow-xs transition-colors outline-none",
						"focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-200",
						"aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-danger-200",
						"disabled:cursor-not-allowed disabled:opacity-100 disabled:border-neutral-100 disabled:bg-neutral-100 disabled:text-neutral-400",
					)}
				/>
			))}
		</div>
	);
}

export { OtpInput };
export type { OtpInputProps };
