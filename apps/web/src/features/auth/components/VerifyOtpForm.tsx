"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@repo/ui/button";
import { OtpInput } from "@repo/ui/otp-input";
import { HelperText } from "@repo/ui/helper-text";
import { toast } from "@repo/ui/sonner";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

function VerifyOtpForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const phone = searchParams.get("phone") || "your phone";

	const [code, setCode] = useState("");
	const [error, setError] = useState<string | undefined>();
	const [submitting, setSubmitting] = useState(false);
	const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

	useEffect(() => {
		if (secondsLeft === 0) return;
		const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
		return () => clearInterval(timer);
	}, [secondsLeft]);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (code.length < CODE_LENGTH) {
			setError("Enter the full 6-digit code");
			return;
		}
		setError(undefined);
		setSubmitting(true);
		// TODO: verify against the real auth API.
		await new Promise((resolve) => setTimeout(resolve, 800));
		setSubmitting(false);
		router.push("/auth/sign-up/personal-details");
	}

	function handleResend() {
		setSecondsLeft(RESEND_SECONDS);
		toast.info("New code sent");
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-h3 text-foreground">Verify your phone</h1>
				<p className="text-b1 text-muted-foreground">
					Enter the 6-digit code we sent to {phone}.{" "}
					<Link href="/auth/sign-up" className="text-primary hover:underline">
						Wrong number?
					</Link>
				</p>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="flex flex-col gap-1.5">
					<OtpInput
						value={code}
						onChange={setCode}
						aria-invalid={!!error}
						disabled={submitting}
					/>
					{error && <HelperText error>{error}</HelperText>}
				</div>

				<Button type="submit" size="large" className="w-full" loading={submitting}>
					Verify
				</Button>
			</form>

			<p className="text-b3 text-muted-foreground text-center">
				{secondsLeft > 0 ? (
					`Resend code in ${secondsLeft}s`
				) : (
					<button
						type="button"
						onClick={handleResend}
						className="text-primary font-medium hover:underline"
					>
						Resend code
					</button>
				)}
			</p>
		</div>
	);
}

export { VerifyOtpForm };
