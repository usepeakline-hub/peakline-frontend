"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { PhoneInput } from "@repo/ui/phone-input";
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
	merchantSetupSchema,
	type MerchantSetupValues,
} from "@/lib/validations/authValidations";
import { useSubmitMerchantSetup } from "@/features/auth/hooks";

/**
 * Merchant branch of Sign Up — only reached when Account Type is "merchant"
 * (Sign Up -> Account Type -> Merchant Setup -> Verify -> Personal Details
 * -> Wallet Created); Personal accounts skip this step entirely.
 */
function MerchantSetupForm() {
	const router = useRouter();
	const form = useForm<MerchantSetupValues>({
		resolver: zodResolver(merchantSetupSchema),
		defaultValues: {
			businessName: "",
			businessCategory: "",
			phone: "",
			businessLocation: "",
		},
	});
	const submitMerchantSetup = useSubmitMerchantSetup();

	function onSubmit(values: MerchantSetupValues) {
		submitMerchantSetup.mutate(values, {
			onSuccess: () => {
				toast.success("Check your email for a verification code");
				router.push("/auth/sign-up/verify-otp");
			},
		});
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-h4 sm:text-h3 text-foreground">
					Set up your merchant account
				</h1>
				<p className="text-sm sm:text-b1 text-muted-foreground sm:w-3/4">
					Join Peakline and start accepting payments and managing your
					business transactions securely.
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
								<FormLabel>Business name</FormLabel>
								<FormControl>
									<Input placeholder="Enter your business name" {...field} />
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
								<FormLabel>Business category</FormLabel>
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
								<FormLabel>Contact information</FormLabel>
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
						name="businessLocation"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Business location</FormLabel>
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

					<Button
						type="submit"
						size="large"
						className="w-full"
						loading={submitMerchantSetup.isPending}
					>
						Set up Account
					</Button>
				</form>
			</Form>
		</div>
	);
}

export { MerchantSetupForm };
