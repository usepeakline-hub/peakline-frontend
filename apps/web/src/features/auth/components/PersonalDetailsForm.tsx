"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { HelperText } from "@repo/ui/helper-text";
import { toast } from "@repo/ui/sonner";

interface FieldErrors {
	fullName?: string;
	dateOfBirth?: string;
}

function validate(fullName: string, dateOfBirth: string): FieldErrors {
	const errors: FieldErrors = {};
	if (!fullName.trim()) errors.fullName = "Enter your full name";
	if (!dateOfBirth) errors.dateOfBirth = "Enter your date of birth";
	return errors;
}

/** Last step of Sign Up per the brief's journey (Sign Up → Verify → Personal Details → Wallet Created). */
function PersonalDetailsForm() {
	const router = useRouter();
	const [fullName, setFullName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [errors, setErrors] = useState<FieldErrors>({});
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const nextErrors = validate(fullName, dateOfBirth);
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) return;

		setSubmitting(true);
		// TODO: save via the real profile API — the wallet gets created server-side from here.
		await new Promise((resolve) => setTimeout(resolve, 800));
		setSubmitting(false);
		toast.success("Wallet created — welcome to Peakline");
		router.push("/");
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-h3 text-foreground">Tell us about yourself</h1>
				<p className="text-b1 text-muted-foreground">
					A few details so we can set up your wallet.
				</p>
			</div>

			<form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="personal-full-name">Full name</Label>
					<Input
						id="personal-full-name"
						placeholder="e.g. Ama Owusu"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						aria-invalid={!!errors.fullName}
					/>
					{errors.fullName && <HelperText error>{errors.fullName}</HelperText>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="personal-dob">Date of birth</Label>
					<Input
						id="personal-dob"
						type="date"
						value={dateOfBirth}
						onChange={(e) => setDateOfBirth(e.target.value)}
						aria-invalid={!!errors.dateOfBirth}
					/>
					{errors.dateOfBirth && (
						<HelperText error>{errors.dateOfBirth}</HelperText>
					)}
				</div>

				<Button type="submit" size="large" className="w-full" loading={submitting}>
					Continue
				</Button>
			</form>
		</div>
	);
}

export { PersonalDetailsForm };
