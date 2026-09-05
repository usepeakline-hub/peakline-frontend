"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { PasswordInput } from "@repo/ui/password-input";
import { PhoneInput } from "@repo/ui/phone-input";
import { Checkbox } from "@repo/ui/checkbox";
import { GoogleIcon } from "@repo/ui/google-icon";
import { cn } from "@repo/ui/lib/utils";
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
	signUpSchema,
	PASSWORD_RULES,
	type SignUpValues,
} from "@/lib/validations/authValidations";
import { useSignUp } from "@/features/auth/hooks";
import { useSignUpFlowStore } from "@/lib/stores/signUpFlowStore";

/**
 * Account-creation step only (matches the brief's "Sign Up" step in
 * Landing → Sign Up → Account Type → ... → Wallet Created). Name and other
 * profile fields belong to the later Personal Details step, not here — the
 * Figma sheet for this screen (node 127:3234) also has a Full Name field,
 * but that's a design/flow inconsistency, not a change to make here.
 */
function SignUpForm() {
	const router = useRouter();
	const setEmail = useSignUpFlowStore((state) => state.setEmail);
	const setPhone = useSignUpFlowStore((state) => state.setPhone);
	const form = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: { email: "", phone: "", password: "", agreeToTerms: false },
	});
	const signUp = useSignUp();
	const password = useWatch({ control: form.control, name: "password" });

	function onSubmit(values: SignUpValues) {
		signUp.mutate(values, {
			onSuccess: () => {
				setEmail(values.email);
				setPhone(values.phone);
				toast.success("Account created");
				router.push("/auth/sign-up/account-type");
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
					Create your account
				</h1>
				<p className="text-sm sm:text-b1 text-muted-foreground sm:w-3/4">
					Join Peakline and start sending, receiving and paying securely.
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
								<FormLabel>Email address</FormLabel>
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
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone number</FormLabel>
								<FormControl>
									<PhoneInput
										name={field.name}
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
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
										autoComplete="new-password"
										placeholder="Enter password"
										{...field}
									/>
								</FormControl>
								<ul className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
									{PASSWORD_RULES.map((rule) => {
										const met = rule.test(password);
										return (
											<li
												key={rule.key}
												className={cn(
													"flex items-center gap-1.5 text-c1",
													met ? "text-success" : "text-muted-foreground",
												)}
											>
												{met ? (
													<Check
														className="size-3.5 shrink-0"
														aria-hidden="true"
													/>
												) : (
													<span
														className="size-3.5 shrink-0 rounded-full border border-current"
														aria-hidden="true"
													/>
												)}
												{rule.label}
											</li>
										);
									})}
								</ul>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="agreeToTerms"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-start gap-3">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											className="mt-0.5"
										/>
									</FormControl>
									<FormLabel className="block text-sm font-normal text-foreground">
										I agree to the{" "}
										<span className="font-medium text-primary">
											Terms of Service
										</span>{" "}
										and{" "}
										<span className="font-medium text-primary">
											Privacy Policy
										</span>
									</FormLabel>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						size="large"
						className="w-full"
						loading={signUp.isPending}
					>
						Create Account
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
					Continue with Google
				</Button>
			</div>
		</div>
	);
}

export { SignUpForm };
