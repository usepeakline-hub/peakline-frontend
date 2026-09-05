"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { OtpInput } from "@repo/ui/otp-input";
import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from "@repo/ui/form";
import { toast } from "@repo/ui/sonner";
import verifyEmailIllustration from "@repo/ui/assets/illustrations/auth/verify-email-illustration.svg";
import {
	verifyOtpSchema,
	type VerifyOtpValues,
} from "@/lib/validations/authValidations";
import { useVerifyOtp } from "@/features/auth/hooks";
import { useSignUpFlowStore } from "@/lib/stores/signUpFlowStore";

const RESEND_SECONDS = 45;

/**
 * Common to both Sign Up branches — reached from Account Type directly
 * (personal) or from Merchant Setup (merchant). Verifies the email address
 * from Sign Up, not the phone number (Figma node 127:2709, "Verify your
 * email" — the phone collected earlier is for contact/SMS elsewhere, not
 * this code).
 */
function VerifyOtpForm() {
	const router = useRouter();
	const email = useSignUpFlowStore((state) => state.email) || "your email";

	const form = useForm<VerifyOtpValues>({
		resolver: zodResolver(verifyOtpSchema),
		defaultValues: { code: "" },
	});
	const verifyOtp = useVerifyOtp();
	const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

	useEffect(() => {
		if (secondsLeft === 0) return;
		const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
		return () => clearInterval(timer);
	}, [secondsLeft]);

	function onSubmit(values: VerifyOtpValues) {
		verifyOtp.mutate(
			{ ...values, email },
			{ onSuccess: () => router.push("/auth/sign-up/personal-details") },
		);
	}

	function handleResend() {
		setSecondsLeft(RESEND_SECONDS);
		toast.info("New code sent");
	}

	function handleUseAnotherMethod() {
		// TODO: offer SMS-to-phone as an alternative once that channel exists.
		toast.info("Other verification methods are coming soon");
	}

	return (
		<div className="flex flex-col items-center gap-8 text-center">
			<Image src={verifyEmailIllustration} alt="" className="size-32" />

			<div className="flex flex-col gap-2">
				<h1 className="text-h4 sm:text-h3 text-foreground">
					Verify your email
				</h1>
				<p className="text-sm sm:text-b1 text-muted-foreground">
					We&apos;ve sent a 6-digit verification code to{" "}
					<span className="font-semibold text-foreground">{email}</span>
				</p>
			</div>

			<Form {...form}>
				<form
					noValidate
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex w-full flex-col items-center gap-5"
				>
					<FormField
						control={form.control}
						name="code"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<OtpInput
										value={field.value}
										onChange={field.onChange}
										disabled={verifyOtp.isPending}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<p className="text-b3 text-muted-foreground">
						Didn&apos;t receive the code?{" "}
						{secondsLeft > 0 ? (
							`Resend code in 00:${String(secondsLeft).padStart(2, "0")}`
						) : (
							<button
								type="button"
								onClick={handleResend}
								className="font-medium text-primary underline hover:no-underline"
							>
								Resend code
							</button>
						)}
					</p>

					<Button
						type="submit"
						size="large"
						className="w-full"
						loading={verifyOtp.isPending}
					>
						Verify email
					</Button>
				</form>
			</Form>

			<button
				type="button"
				onClick={handleUseAnotherMethod}
				className="text-b3 font-medium text-muted-foreground underline hover:text-foreground"
			>
				Use another method
			</button>
		</div>
	);
}

export { VerifyOtpForm };
