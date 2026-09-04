"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { PasswordInput } from "@repo/ui/password-input";
import { Label } from "@repo/ui/label";
import { HelperText } from "@repo/ui/helper-text";
import { toast } from "@repo/ui/sonner";

interface FieldErrors {
	email?: string;
	password?: string;
}

function validate(email: string, password: string): FieldErrors {
	const errors: FieldErrors = {};
	if (!email.trim()) errors.email = "Enter your email address";
	else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address";
	if (!password) errors.password = "Enter your password";
	return errors;
}

function SignInForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<FieldErrors>({});
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const nextErrors = validate(email, password);
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) return;

		setSubmitting(true);
		// TODO: wire up to the real auth API once it exists.
		await new Promise((resolve) => setTimeout(resolve, 800));
		setSubmitting(false);
		toast.success("Signed in");
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-h3 text-foreground">Welcome back</h1>
				<p className="text-b1 text-muted-foreground">
					Sign in to continue to your wallet.
				</p>
			</div>

			<form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="sign-in-email">Email</Label>
					<Input
						id="sign-in-email"
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
					<div className="flex items-center justify-between">
						<Label htmlFor="sign-in-password">Password</Label>
						<Link
							href="/auth/forgot-password"
							className="text-c1 text-primary hover:underline"
						>
							Forgot password?
						</Link>
					</div>
					<PasswordInput
						id="sign-in-password"
						autoComplete="current-password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						aria-invalid={!!errors.password}
					/>
					{errors.password && <HelperText error>{errors.password}</HelperText>}
				</div>

				<Button type="submit" size="large" className="w-full" loading={submitting}>
					Sign in
				</Button>
			</form>

			<p className="text-b3 text-muted-foreground text-center">
				Don&apos;t have an account?{" "}
				<Link href="/auth/sign-up" className="text-primary font-medium hover:underline">
					Sign up
				</Link>
			</p>
		</div>
	);
}

export { SignInForm };
