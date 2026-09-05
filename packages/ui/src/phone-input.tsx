"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "./lib/utils";
import { Input } from "./input";

const GHANA_COUNTRY_CODE = "+233";

interface PhoneInputProps
	extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> {
	/** Full phone value, e.g. "+233 24 123 4567" — the country code is always Ghana's for now. */
	value: string;
	onChange: (value: string) => void;
}

/**
 * Ghana-only compound phone field (flag + fixed +233 code, then the national
 * number) — the country dropdown is a visual affordance from the Sign Up
 * sheet, not yet wired to anything, since the MVP only supports Ghana.
 * `value`/`onChange` still carry the single combined "+233 ..." string the
 * rest of the sign-up flow (and `signUpSchema`) already expects.
 */
function PhoneInput({
	value,
	onChange,
	className,
	disabled,
	id,
	placeholder = "XX XXX XXXX",
	...props
}: PhoneInputProps) {
	const national = value.startsWith(GHANA_COUNTRY_CODE)
		? value.slice(GHANA_COUNTRY_CODE.length).trim()
		: value;

	return (
		<div className={cn("flex gap-2", className)}>
			<div
				aria-hidden="true"
				className={cn(
					"flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-input bg-background px-3 text-b1 text-foreground",
					disabled && "opacity-50",
				)}
			>
				<span>🇬🇭</span>
				<span>{GHANA_COUNTRY_CODE}</span>
				<ChevronDown className="size-4 text-muted-foreground" />
			</div>
			<Input
				id={id}
				type="tel"
				inputMode="numeric"
				autoComplete="tel-national"
				placeholder={placeholder}
				value={national}
				disabled={disabled}
				onChange={(e) => {
					// Sanitize as-you-type: digits only, drop a leading trunk "0"
					// (e.g. "024...") since the country code already replaces it,
					// cap at the 9 digits a Ghana mobile number has.
					const digits = e.target.value
						.replace(/\D/g, "")
						.replace(/^0+/, "")
						.slice(0, 9);
					onChange(digits ? `${GHANA_COUNTRY_CODE} ${digits}` : "");
				}}
				{...props}
			/>
		</div>
	);
}

export { PhoneInput, GHANA_COUNTRY_CODE };
export type { PhoneInputProps };
