"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Smartphone } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@repo/ui/form";
import { cn } from "@repo/ui/lib/utils";
import {
	twoFactorMethodSchema,
	type TwoFactorMethodValues,
} from "@/lib/validations/authValidations";
import { useSubmitTwoFactorMethod } from "@/features/auth/hooks";
import { useLoginFlowStore } from "@/lib/stores/loginFlowStore";

const METHODS = [
	{
		value: "email",
		icon: Mail,
		title: "Email Verification Code",
		description: "We'll send a 6-digit code to your email address.",
	},
	{
		value: "authenticator",
		icon: Smartphone,
		title: "Authenticator App",
		description: "Enter the code from your authenticator app.",
	},
] as const;

/**
 * Every login goes through 2FA — this is the method picker in between Sign
 * In and Verify (Figma node 150:3004, confirmed via screenshot). The card
 * descriptions there are leftover copy-paste from the Account Type sheet
 * ("Send, receive and pay with your Peakline wallet." on the *email* card) —
 * written sensible ones instead rather than reproducing that mismatch.
 */
function TwoFactorMethodForm() {
	const router = useRouter();
	const email = useLoginFlowStore((state) => state.email);
	const setTwoFactorMethod = useLoginFlowStore(
		(state) => state.setTwoFactorMethod,
	);
	const form = useForm<TwoFactorMethodValues>({
		resolver: zodResolver(twoFactorMethodSchema),
		defaultValues: { method: undefined },
	});
	const submitMethod = useSubmitTwoFactorMethod();

	// Reached without a completed Sign In in this session — send them back.
	useEffect(() => {
		if (!email) {
			router.replace("/auth/sign-in");
		}
	}, [email, router]);

	if (!email) return null;

	function onSubmit(values: TwoFactorMethodValues) {
		submitMethod.mutate(values, {
			onSuccess: () => {
				setTwoFactorMethod(values.method);
				router.push("/auth/sign-in/verify");
			},
		});
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-h4 sm:text-h3 text-foreground">
					Verify it&apos;s you
				</h1>
				<p className="text-sm sm:text-b1 text-muted-foreground">
					For your security, choose how you&apos;d like to verify your
					account.
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
						name="method"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div
										role="radiogroup"
										aria-label="Verification method"
										className="flex flex-col gap-4"
									>
										{METHODS.map(({ value, icon: Icon, title, description }) => {
											const selected = field.value === value;
											return (
												<button
													key={value}
													type="button"
													role="radio"
													aria-checked={selected}
													onClick={() => field.onChange(value)}
													className={cn(
														"flex w-full items-center gap-5 rounded-xl border border-border p-5 text-left transition-colors sm:gap-6 sm:p-6",
														"hover:border-primary-300",
														"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
														selected && "border-primary-500 bg-accent",
													)}
												>
													<span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-primary-500/10 sm:size-16">
														<Icon
															className="size-6 text-primary-500 sm:size-7"
															aria-hidden="true"
														/>
													</span>
													<span className="flex flex-col gap-1">
														<span className="text-s1 text-foreground">
															{title}
														</span>
														<span className="text-b3 text-muted-foreground">
															{description}
														</span>
													</span>
												</button>
											);
										})}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						size="large"
						className="w-full"
						loading={submitMethod.isPending}
					>
						Continue
					</Button>
				</form>
			</Form>
		</div>
	);
}

export { TwoFactorMethodForm };
