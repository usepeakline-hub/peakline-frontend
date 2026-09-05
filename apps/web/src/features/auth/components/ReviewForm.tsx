"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Stepper } from "@repo/ui/stepper";
import { toast } from "@repo/ui/sonner";
import { DOCUMENT_TYPES } from "@/lib/validations/authValidations";
import { useCompleteSignUp } from "@/features/auth/hooks";
import { useSignUpFlowStore } from "@/lib/stores/signUpFlowStore";
import { usePersonalInfoFlowStore } from "@/lib/stores/personalInfoFlowStore";
import { PERSONAL_INFO_STEPS } from "@/features/auth/components/PersonalDetailsForm";

function SummarySection({
	title,
	editHref,
	rows,
}: {
	title: string;
	editHref: string;
	rows: { label: string; value: string }[];
}) {
	const router = useRouter();
	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border p-5">
			<div className="flex items-center justify-between">
				<h2 className="text-b2 text-foreground">{title}</h2>
				<button
					type="button"
					onClick={() => router.push(editHref)}
					className="text-b4 font-medium text-primary hover:underline"
				>
					Edit
				</button>
			</div>
			<dl className="flex flex-col gap-2">
				{rows.map(({ label, value }) => (
					<div key={label} className="flex items-baseline justify-between gap-4">
						<dt className="text-b3 text-muted-foreground">{label}</dt>
						<dd className="truncate text-b3 font-medium text-foreground">
							{value || "—"}
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
}

/**
 * Step 3 (Review) — a read-only cross-check of everything collected across
 * Sign Up, Personal Information and ID Verification before the account is
 * actually created. Confirming here is what "logs the user in" per the
 * brief; PIN setup (and the wallet it triggers) comes right after.
 */
function ReviewForm() {
	const router = useRouter();
	const email = useSignUpFlowStore((state) => state.email);
	const phone = useSignUpFlowStore((state) => state.phone);
	const personalDetails = usePersonalInfoFlowStore(
		(state) => state.personalDetails,
	);
	const idVerification = usePersonalInfoFlowStore(
		(state) => state.idVerification,
	);
	const completeSignUp = useCompleteSignUp();

	useEffect(() => {
		if (!personalDetails || !idVerification) {
			router.replace("/auth/sign-up/personal-details");
		}
	}, [personalDetails, idVerification, router]);

	if (!personalDetails || !idVerification) return null;

	const documentLabel =
		DOCUMENT_TYPES.find((type) => type.value === idVerification.documentType)
			?.label ?? idVerification.documentType;

	function handleConfirm() {
		completeSignUp.mutate(
			{ ...personalDetails!, ...idVerification! },
			{
				onSuccess: () => {
					toast.success("Account verified");
					router.push("/auth/sign-up/set-pin");
				},
			},
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<Stepper steps={PERSONAL_INFO_STEPS} currentStep={3} />

			<div className="flex flex-col gap-2">
				<h1 className="text-h4 sm:text-h3 text-foreground">
					Review your details
				</h1>
				<p className="text-sm sm:text-b1 text-muted-foreground">
					Take a moment to make sure everything below is correct.
				</p>
			</div>

			<div className="flex flex-col gap-4">
				<SummarySection
					title="Account"
					editHref="/auth/sign-up"
					rows={[
						{ label: "Email", value: email },
						{ label: "Phone", value: phone },
					]}
				/>

				<SummarySection
					title="Personal information"
					editHref="/auth/sign-up/personal-details"
					rows={[
						{ label: "Date of birth", value: personalDetails.dateOfBirth },
						{ label: "Nationality", value: personalDetails.nationality },
						{
							label: "Residential address",
							value: personalDetails.residentialAddress,
						},
						{ label: "City", value: personalDetails.city },
					]}
				/>

				<SummarySection
					title="ID verification"
					editHref="/auth/sign-up/personal-details/id-verification"
					rows={[
						{ label: "Document type", value: documentLabel },
						{
							label: "Document number",
							value: idVerification.documentNumber,
						},
						{ label: "Front", value: idVerification.documentFront?.name },
						{
							label: "Back",
							value: idVerification.documentBack?.name ?? "Not required",
						},
					]}
				/>
			</div>

			<Button
				type="button"
				size="large"
				className="w-full"
				loading={completeSignUp.isPending}
				onClick={handleConfirm}
			>
				Confirm and continue
			</Button>
		</div>
	);
}

export { ReviewForm };
