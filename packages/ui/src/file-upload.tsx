"use client";

import * as React from "react";
import { FileText, Upload, X } from "lucide-react";

import { cn } from "./lib/utils";

interface FileUploadProps {
	id?: string;
	name?: string;
	value: File | null | undefined;
	onChange: (file: File | null) => void;
	accept?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	"aria-invalid"?: boolean;
}

/** A single file picker styled like `Input` — dashed border, shows the
 * chosen filename once picked, with a clear (X) button to swap it out. */
function FileUpload({
	id,
	name,
	value,
	onChange,
	accept = "image/*,.pdf",
	placeholder = "Click to upload",
	disabled,
	className,
	"aria-invalid": ariaInvalid,
}: FileUploadProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);

	return (
		<div className={cn("relative", className)}>
			<input
				ref={inputRef}
				id={id}
				name={name}
				type="file"
				accept={accept}
				disabled={disabled}
				aria-invalid={ariaInvalid}
				className="sr-only"
				onChange={(e) => onChange(e.target.files?.[0] ?? null)}
			/>
			<label
				htmlFor={id}
				className={cn(
					"flex h-11 w-full cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input bg-background px-3.5 text-b1 transition-colors",
					"hover:border-primary-300",
					value ? "text-foreground" : "text-neutral-200",
					ariaInvalid && "border-destructive",
					disabled && "cursor-not-allowed opacity-50",
				)}
			>
				{value ? (
					<FileText
						className="size-4 shrink-0 text-primary-500"
						aria-hidden="true"
					/>
				) : (
					<Upload className="size-4 shrink-0" aria-hidden="true" />
				)}
				<span className="truncate">{value ? value.name : placeholder}</span>
				{value && (
					<button
						type="button"
						aria-label="Remove file"
						onClick={(e) => {
							e.preventDefault();
							onChange(null);
							if (inputRef.current) inputRef.current.value = "";
						}}
						className="ml-auto shrink-0 text-muted-foreground hover:text-destructive"
					>
						<X className="size-4" aria-hidden="true" />
					</button>
				)}
			</label>
		</div>
	);
}

export { FileUpload };
export type { FileUploadProps };
