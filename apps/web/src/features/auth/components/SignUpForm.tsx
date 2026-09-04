"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { PasswordInput } from "@repo/ui/password-input";
import { Label } from "@repo/ui/label";
import { HelperText } from "@repo/ui/helper-text";
import { toast } from "@repo/ui/sonner";

interface FieldErrors {
	phone?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

function validate(
	phone: string,
	email: string,
	password: string,
	confirmPassword: string,
): FieldErrors {
	const errors: FieldErrors = {};
	if (!phone.trim()) errors.phone = "Enter your phone number";
	if (!email.trim()) errors.email = "Enter your email address";
	else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address";
	if (!password) errors.password = "Create a password";
	else if (password.length < 8) errors.password = "Use at least 8 characters";
	if (confirmPassword !== password) errors.confirmPassword = "Passwords don't match";
	return errors;
}

/**
 * Account-creation step only (matches the brief's "Sign Up" step in
 * Landing → Sign Up → Verify → Personal Details → Wallet Created). Name and
 * other profile fields belong to the later Personal Details step, not here.
 */
function SignUpForm() {
	const router = useRouter();
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState<FieldErrors>({});
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const nextErrors = validate(phone, email, password, confirmPassword);
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) return;

		setSubmitting(true);
		// TODO: wire up to the real auth API.
		await new Promise((resolve) => setTimeout(resolve, 800));
		setSubmitting(false);
		toast.success("Account created — check your phone for a verification code");
		router.push(`/auth/sign-up/verify-otp?phone=${encodeURIComponent(phone)}`);
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-h3 text-foreground">Create your account</h1>
				<p className="text-b1 text-muted-foreground">
					Set up your Peakline wallet in a few steps.
				</p>
			</div>

			<form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="sign-up-phone">Phone number</Label>
					<Input
						id="sign-up-phone"
						type="tel"
						autoComplete="tel"
						placeholder="+233 XX XXX XXXX"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						aria-invalid={!!errors.phone}
					/>
					{errors.phone && <HelperText error>{errors.phone}</HelperText>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="sign-up-email">Email</Label>
					<Input
						id="sign-up-email"
						type="email"
						autoComplete="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						aria-invalid={!!errors.email}
					/>
					{errors.email && <HelperText error>{errors.email}</HelperText>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="sign-up-password">Password</Label>
					<PasswordInput
						id="sign-up-password"
						autoComplete="new-password"
						placeholder="At least 8 characters"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						aria-invalid={!!errors.password}
					/>
					{errors.password && <HelperText error>{errors.password}</HelperText>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="sign-up-confirm-password">Confirm password</Label>
					<PasswordInput
						id="sign-up-confirm-password"
						autoComplete="new-password"
						placeholder="Re-enter your password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						aria-invalid={!!errors.confirmPassword}
					/>
					{errors.confirmPassword && (
						<HelperText error>{errors.confirmPassword}</HelperText>
					)}
				</div>

				<Button type="submit" size="large" className="w-full" loading={submitting}>
					Create account
				</Button>
			</form>

			<p className="text-b3 text-muted-foreground text-center">
				Already have an account?{" "}
				<Link href="/auth/sign-in" className="text-primary font-medium hover:underline">
					Sign in
				</Link>
			</p>
		</div>
	);
}

export { SignUpForm };
