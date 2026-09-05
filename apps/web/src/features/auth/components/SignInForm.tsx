"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { PasswordInput } from "@repo/ui/password-input";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@repo/ui/form";
import { toast } from "@repo/ui/sonner";
import {
	signInSchema,
	type SignInValues,
} from "@/lib/validations/authValidations";
import { useSignIn } from "@/features/auth/hooks";

function SignInForm() {
	const form = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: "", password: "" },
	});
	const signIn = useSignIn();

	function onSubmit(values: SignInValues) {
		signIn.mutate(values, {
			onSuccess: () => toast.success("Signed in"),
		});
	}

	return (
		<div className="flex flex-col gap-8 mt-24">
			<div className="flex flex-col gap-2">
				<h1 className="text-h3 text-foreground">Welcome back</h1>
				<p className="text-b1 text-muted-foreground">
					Sign in to continue to your wallet.
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
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										autoComplete="email"
										placeholder="you@example.com"
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
								<div className="flex items-center justify-between">
									<FormLabel>Password</FormLabel>
									<Link
										href="/auth/forgot-password"
										className="text-c1 text-primary hover:underline"
									>
										Forgot password?
									</Link>
								</div>
								<FormControl>
									<PasswordInput
										autoComplete="current-password"
										placeholder="Enter your password"
										{...field}
									/>
								</FormControl>
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
						Sign in
					</Button>
				</form>
			</Form>
		</div>
	);
}

export { SignInForm };
