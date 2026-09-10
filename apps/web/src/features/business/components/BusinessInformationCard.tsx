"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { Badge } from "@repo/ui/badge";
import { Skeleton } from "@repo/ui/skeleton";
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
import { COUNTRY_NAMES } from "@repo/ui/lib/country-names";
import { BUSINESS_CATEGORIES } from "@/lib/validations/authValidations";
import {
	updateBusinessSchema,
	type UpdateBusinessValues,
} from "@/lib/validations/businessValidations";
import { useMyBusiness, useUpdateBusiness } from "@/features/business/hooks";
import { getApiErrorMessage } from "@/lib/api/errorMessage";
import { DeleteBusinessDialog } from "@/features/business/components/DeleteBusinessDialog";
import type { BusinessData } from "@/lib/api/types";

const CATEGORY_LABEL = Object.fromEntries(BUSINESS_CATEGORIES.map((c) => [c.value, c.label]));

// The real values this can hold aren't documented (BusinessDto just says
// `"type": "object"` for `status`) — a neutral badge by default, colored
// for the two values the admin verify/suspend endpoints imply must exist,
// so an unexpected value still renders sensibly instead of breaking.
const STATUS_BADGE: Record<string, "completed" | "failed" | "outline"> = {
	active: "completed",
	verified: "completed",
	suspended: "failed",
};

function toFormValues(business: BusinessData): UpdateBusinessValues {
	return {
		name: business.name,
		category: business.category,
		country: business.country,
		city: business.city ?? "",
		address: business.address ?? "",
		phone: business.phone ?? "",
		website: business.website ?? "",
		description: business.description ?? "",
		registrationNumber: business.registrationNumber ?? "",
		taxId: business.taxId ?? "",
	};
}

function CardSkeleton() {
	return (
		<div className="flex flex-col gap-4 lg:rounded-2xl lg:border lg:border-border lg:bg-background lg:p-6">
			<Skeleton className="h-6 w-40" />
			<Skeleton className="h-11 w-full" />
			<Skeleton className="h-11 w-full" />
			<Skeleton className="h-11 w-full" />
		</div>
	);
}

/**
 * Business Information's own settings-page counterpart to
 * `PersonalInformationCard` — same inline-edit shape (read-only inputs
 * until "Edit", Cancel/Save vs Edit/Delete), but real end to end
 * (`GET/PATCH/DELETE /businesses/{id}`) rather than a stub, and a fuller
 * field set than onboarding's own form collects (website/description/
 * registration number/tax ID are only editable from here). No mock exists
 * for this screen either — follows the same established card conventions
 * as everything else in Account.
 */
function BusinessInformationCard() {
	const { data: business, isLoading } = useMyBusiness();
	const [isEditing, setIsEditing] = useState(false);
	const updateBusiness = useUpdateBusiness(business?.id ?? "");
	const form = useForm<UpdateBusinessValues>({
		resolver: zodResolver(updateBusinessSchema),
		defaultValues: business
			? toFormValues(business)
			: {
					name: "",
					category: "" as unknown as UpdateBusinessValues["category"],
					country: "",
					city: "",
					address: "",
					phone: "",
					website: "",
					description: "",
					registrationNumber: "",
					taxId: "",
				},
	});

	// Reset the form once the real business loads (or changes) — the form
	// initializes before the query resolves, so its first real values arrive
	// via this effect rather than `defaultValues`.
	useEffect(() => {
		if (business) form.reset(toFormValues(business));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [business]);

	if (isLoading) return <CardSkeleton />;
	if (!business) return null;

	const statusVariant = STATUS_BADGE[business.status.toLowerCase()] ?? "outline";

	function handleCancel() {
		form.reset(toFormValues(business!));
		setIsEditing(false);
	}

	function handleSave(values: UpdateBusinessValues) {
		updateBusiness.mutate(values, {
			onSuccess: () => {
				toast.success("Business updated");
				setIsEditing(false);
			},
			onError: (error) => {
				toast.error(getApiErrorMessage(error, "Couldn't update business"));
			},
		});
	}

	return (
		<Form {...form}>
			<form
				noValidate
				onSubmit={form.handleSubmit(handleSave)}
				className="flex flex-col gap-6 lg:rounded-2xl lg:border lg:border-border lg:bg-background lg:p-6"
			>
				<div className="flex items-center justify-between gap-4">
					<h2 className="text-s1 text-foreground lg:text-s1">Business Information</h2>
					<Badge variant={statusVariant} className="capitalize">
						{business.status}
					</Badge>
				</div>

				<div className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Business Name</FormLabel>
								<FormControl>
									<Input readOnly={!isEditing} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="category"
						render={({ field }) =>
							isEditing ? (
								<FormItem>
									<FormLabel>Business Category</FormLabel>
									<FormControl>
										<Select {...field} value={field.value ?? ""}>
											{BUSINESS_CATEGORIES.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							) : (
								<FormItem>
									<FormLabel>Business Category</FormLabel>
									<FormControl>
										<Input readOnly value={CATEGORY_LABEL[field.value] ?? field.value} />
									</FormControl>
								</FormItem>
							)
						}
					/>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="country"
							render={({ field }) =>
								isEditing ? (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Select {...field} value={field.value ?? ""}>
												{Object.values(COUNTRY_NAMES)
													.sort((a, b) => a.localeCompare(b))
													.map((name) => (
														<option key={name} value={name}>
															{name}
														</option>
													))}
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								) : (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input readOnly value={field.value} />
										</FormControl>
									</FormItem>
								)
							}
						/>

						<FormField
							control={form.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel>City</FormLabel>
									<FormControl>
										<Input readOnly={!isEditing} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Address</FormLabel>
								<FormControl>
									<Input readOnly={!isEditing} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input readOnly={!isEditing} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="website"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Website</FormLabel>
									<FormControl>
										<Input
											readOnly={!isEditing}
											placeholder="https://"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Input readOnly={!isEditing} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="registrationNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Registration Number</FormLabel>
									<FormControl>
										<Input readOnly={!isEditing} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="taxId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tax ID</FormLabel>
									<FormControl>
										<Input readOnly={!isEditing} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className={cn("flex gap-3 pt-2")}>
						{isEditing ? (
							<>
								<Button
									type="button"
									variant="outline"
									className="flex-1"
									onClick={handleCancel}
								>
									Cancel
								</Button>
								<Button type="submit" className="flex-1" loading={updateBusiness.isPending}>
									Save
								</Button>
							</>
						) : (
							<>
								<Button
									type="button"
									variant="outline"
									className="flex-1"
									onClick={() => setIsEditing(true)}
								>
									Edit
								</Button>
								<DeleteBusinessDialog
									businessId={business.id}
									businessName={business.name}
									onDeleted={() => setIsEditing(false)}
								>
									<Button type="button" variant="destructive" className="flex-1">
										Delete
									</Button>
								</DeleteBusinessDialog>
							</>
						)}
					</div>
				</div>
			</form>
		</Form>
	);
}

export { BusinessInformationCard };
