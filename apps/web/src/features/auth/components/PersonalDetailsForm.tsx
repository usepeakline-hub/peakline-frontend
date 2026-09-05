"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
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
	personalDetailsSchema,
	type PersonalDetailsValues,
} from "@/lib/validations/authValidations";
import { usePersonalInfoFlowStore } from "@/lib/stores/personalInfoFlowStore";

export const PERSONAL_INFO_STEPS = [
	"Personal Information",
	"ID Verification",
	"Review",
];

/**
 * Step 1 (Personal Information) of a 3-step profile flow — Personal
 * Information -> ID Verification -> Review — per Figma node 127:3101. No
 * name field here on purpose: neither this step nor Sign Up asks for one in
 * the current Figma, so it's presumably meant to come off the ID document in
 * step 2.
 */
function PersonalDetailsForm() {
	const router = useRouter();
	const stored = usePersonalInfoFlowStore((state) => state.personalDetails);
	const setPersonalDetails = usePersonalInfoFlowStore(
		(state) => state.setPersonalDetails,
	);
	const form = useForm<PersonalDetailsValues>({
		resolver: zodResolver(personalDetailsSchema),
		defaultValues: stored ?? {
			dateOfBirth: "",
			nationality: "",
			residentialAddress: "",
			city: "",
		},
	});

	function onSubmit(values: PersonalDetailsValues) {
		setPersonalDetails(values);
		router.push("/auth/sign-up/personal-details/id-verification");
	}

	return (
		<div className="flex flex-col gap-8">
			<Stepper steps={PERSONAL_INFO_STEPS} currentStep={1} />

			<div className="flex flex-col gap-2">
				<h1 className="text-h4 sm:text-h3 text-foreground">
					Tell us about yourself
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
						name="dateOfBirth"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Date of birth</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="nationality"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nationality</FormLabel>
								<FormControl>
									<Input placeholder="e.g. Ghanaian" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="residentialAddress"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Residential address</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your residential address"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>City</FormLabel>
								<FormControl>
									<Input placeholder="Enter your city" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" size="large" className="w-full">
						Continue
					</Button>
				</form>
			</Form>
		</div>
	);
}

export { PersonalDetailsForm };
