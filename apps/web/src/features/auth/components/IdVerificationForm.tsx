"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { FileUpload } from "@repo/ui/file-upload";
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
	idVerificationSchema,
	DOCUMENT_TYPES,
	type IdVerificationValues,
} from "@/lib/validations/authValidations";
import { usePersonalInfoFlowStore } from "@/lib/stores/personalInfoFlowStore";
import { PERSONAL_INFO_STEPS } from "@/features/auth/components/PersonalDetailsForm";

const TWO_SIDED_DOCUMENT_TYPES = new Set([
	"ghana_card",
	"voters_id",
	"drivers_license",
]);

/**
 * Step 2 (ID Verification) — a document type + number, plus the document
 * itself (both sides, unless it's a single-page Passport). No Figma sheet
 * exists for this step; built to match step 1's pattern.
 */
function IdVerificationForm() {
	const router = useRouter();
	const stored = usePersonalInfoFlowStore((state) => state.idVerification);
	const personalDetails = usePersonalInfoFlowStore(
		(state) => state.personalDetails,
	);
	const setIdVerification = usePersonalInfoFlowStore(
		(state) => state.setIdVerification,
	);
	const form = useForm<IdVerificationValues>({
		resolver: zodResolver(idVerificationSchema),
		defaultValues: {
			documentType: stored?.documentType ?? undefined,
			documentNumber: stored?.documentNumber ?? "",
			documentFront: stored?.documentFront,
			documentBack: stored?.documentBack,
		},
	});
	const documentType = form.watch("documentType");
	const isTwoSided = TWO_SIDED_DOCUMENT_TYPES.has(documentType);

	// Personal Information hasn't been filled in this session — send them
	// back rather than let Review show a blank summary.
	useEffect(() => {
		if (!personalDetails) {
			router.replace("/auth/sign-up/personal-details");
		}
	}, [personalDetails, router]);

	if (!personalDetails) return null;

	function onSubmit(values: IdVerificationValues) {
		setIdVerification(values);
		router.push("/auth/sign-up/personal-details/review");
	}

	return (
		<div className="flex flex-col gap-8">
			<Stepper steps={PERSONAL_INFO_STEPS} currentStep={2} />

			<div className="flex flex-col gap-2">
				<h1 className="text-h4 sm:text-h3 text-foreground">
					Verify your identity
				</h1>
				<p className="text-sm sm:text-b1 text-muted-foreground">
					Upload a government-issued ID so we can confirm it&apos;s really
					you.
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
						name="documentType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Document type</FormLabel>
								<FormControl>
									<Select {...field} value={field.value ?? ""}>
										<option value="" disabled>
											Select document type
										</option>
										{DOCUMENT_TYPES.map((type) => (
											<option key={type.value} value={type.value}>
												{type.label}
											</option>
										))}
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="documentNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Document number</FormLabel>
								<FormControl>
									<Input placeholder="Enter your document number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="documentFront"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{isTwoSided ? "Document — front" : "Document"}
								</FormLabel>
								<FormControl>
									<FileUpload
										name={field.name}
										value={field.value}
										onChange={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{isTwoSided && (
						<FormField
							control={form.control}
							name="documentBack"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Document — back</FormLabel>
									<FormControl>
										<FileUpload
											name={field.name}
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<Button type="submit" size="large" className="w-full">
						Continue
					</Button>
				</form>
			</Form>
		</div>
	);
}

export { IdVerificationForm };
