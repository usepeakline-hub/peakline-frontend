"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { PasswordInput } from "@repo/ui/password-input";
import { GoogleIcon } from "@repo/ui/google-icon";
import { toast } from "@repo/ui/sonner";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@repo/ui/form";
import {
	signInSchema,
	type SignInValues,
} from "@/lib/validations/authValidations";
import { useSignIn } from "@/features/auth/hooks";
import { useLoginFlowStore } from "@/lib/stores/loginFlowStore";

/**
 * Figma node 127:4272, confirmed via screenshot. Every login goes through
 * 2FA per the brief — a successful sign-in moves to the method picker, not
 * straight to the app (Sign In -> 2FA method -> Verify -> Dashboard).
 */
function SignInForm() {
	const router = useRouter();
	const setEmail = useLoginFlowStore((state) => state.setEmail);
	const form = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: "", password: "" },
	});
	const signIn = useSignIn();

	function onSubmit(values: SignInValues) {
		signIn.mutate(values, {
			onSuccess: () => {
				setEmail(values.email);
				router.push("/auth/sign-in/two-factor");
			},
		});
	}

	function handleGoogleContinue() {
		// TODO: wire up once Google OAuth exists on the backend.
		toast.info("Continue with Google is coming soon");
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-h4 sm:text-h3 text-foreground">
					Welcome Back!
				</h1>
				<p className="text-sm sm:text-b1 text-muted-foreground">
					Login to your Peakline account to start sending, receiving and
					paying securely.
				</p>
			</div>

			<Form {...form}>
				<form
					noValidate
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-5"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email Address</FormLabel>
								<FormControl>
									<Input
										type="email"
										autoComplete="email"
										placeholder="Enter your email address"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<PasswordInput
										autoComplete="current-password"
										placeholder="Enter password"
										{...field}
									/>
								</FormControl>
								<div className="flex justify-end">
									<Link
										href="/auth/forgot-password"
										className="text-c1 text-primary hover:underline"
									>
										Forgot Password?
									</Link>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						size="large"
						className="w-full"
						loading={signIn.isPending}
					>
						Log in
					</Button>
				</form>
			</Form>

			<div className="flex flex-col items-center gap-5">
				<p className="text-b1 text-muted-foreground">Or continue with</p>
				<Button
					type="button"
					variant="outline"
					size="large"
					className="w-full sm:w-4/5"
					onClick={handleGoogleContinue}
				>
					<GoogleIcon />
					Google
				</Button>
			</div>
		</div>
	);
}

export { SignInForm };
