"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { PhoneInput } from "@repo/ui/phone-input";
import { Stepper } from "@repo/ui/stepper";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@repo/ui/form";
import {
	merchantSetupSchema,
	type MerchantSetupValues,
} from "@/lib/validations/authValidations";
import { usePersonalInfoFlowStore } from "@/lib/stores/personalInfoFlowStore";
import { useSignUpFlowStore } from "@/lib/stores/signUpFlowStore";
import { getOnboardingSteps } from "@/features/auth/onboardingSteps";

/**
 * Step 2 of 3 — merchant accounts only (Individual skips straight from
 * Personal Information to Review). Stored locally like Personal
 * Information is, not submitted on its own — the whole onboarding payload
 * goes to the backend together on Review's final confirm.
 */
function BusinessInformationForm() {
	const router = useRouter();
	const accountType = useSignUpFlowStore((state) => state.accountType);
	const personalDetails = usePersonalInfoFlowStore((state) => state.personalDetails);
	const stored = usePersonalInfoFlowStore((state) => state.businessInfo);
	const setBusinessInfo = usePersonalInfoFlowStore((state) => state.setBusinessInfo);
	const form = useForm<MerchantSetupValues>({
		resolver: zodResolver(merchantSetupSchema),
		defaultValues: stored ?? {
			businessName: "",
			businessCategory: "",
			phone: "",
			businessLocation: "",
		},
	});

	// Reached without Personal Information filled in this session — send
	// back rather than let Review show a blank summary.
	useEffect(() => {
		if (!personalDetails) {
			router.replace("/auth/sign-up/personal-details");
		}
	}, [personalDetails, router]);

	if (!personalDetails) return null;

	function onSubmit(values: MerchantSetupValues) {
		setBusinessInfo(values);
		router.push("/auth/sign-up/personal-details/review");
	}

	return (
		<div className="flex flex-col gap-8">
			<Stepper steps={getOnboardingSteps(accountType)} currentStep={2} />

			<div className="flex flex-col gap-2">
				<h1 className="text-h4 sm:text-h3 text-foreground">
					Your Business Information
				</h1>
				<p className="text-sm sm:text-b1 text-muted-foreground">
					This helps us secure your account and comply with regulations.
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
						name="businessName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Business Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter business name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="businessCategory"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Business Category</FormLabel>
								<FormControl>
									<Input
										placeholder="e.g. Retail, Restaurant, Salon"
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
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<PhoneInput
										name={field.name}
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										placeholder="Enter your phone number"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="businessLocation"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Business Location</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your business location"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex gap-3">
						<Button
							type="button"
							variant="outline"
							size="large"
							className="flex-1"
							onClick={() => router.push("/auth/sign-up/personal-details")}
						>
							Back
						</Button>
						<Button type="submit" size="large" className="flex-1">
							Next
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

export { BusinessInformationForm };
