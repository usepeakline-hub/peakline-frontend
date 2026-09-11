"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Skeleton } from "@repo/ui/skeleton";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@repo/ui/form";
import { toast } from "@repo/ui/sonner";
import { UserAvatar } from "@/features/dashboard/components/UserAvatar";
import {
	useProfile,
	useUpdateProfile,
	useCancelAccountDeletion,
} from "@/features/profile/hooks";
import { getApiErrorMessage } from "@/lib/api/errorMessage";
import { DeleteAccountDialog } from "@/features/profile/components/DeleteAccountDialog";
import { profileSchema, type ProfileValues } from "@/lib/validations/profileValidations";
import type { ProfileData } from "@/lib/api/types";

function toFormValues(profile: ProfileData): ProfileValues {
	return {
		firstName: profile.firstName,
		lastName: profile.lastName,
		otherName: profile.otherName ?? "",
		username: profile.username ?? "",
	};
}

function CardSkeleton() {
	return (
		<div className="flex flex-col gap-6 lg:rounded-2xl lg:border lg:border-border lg:bg-background lg:p-6">
			<div className="flex flex-col items-center gap-3">
				<Skeleton className="size-20 rounded-full" />
				<Skeleton className="h-9 w-32" />
			</div>
			<Skeleton className="h-11 w-full" />
			<Skeleton className="h-11 w-full" />
			<Skeleton className="h-11 w-full" />
		</div>
	);
}

/**
 * Real as of `GET/PATCH /users/me` — previously a hardcoded fake
 * `DEFAULT_VALUES` object with a stub `useUpdateProfile`. Email and phone
 * number are shown but permanently read-only (never wrapped in
 * `FormField` — they're not even in `profileSchema` anymore): the API has
 * no endpoint yet for changing either, "a separate verified-change flow"
 * per its own docs. "Change Profile" (avatar) stays an honest stub — no
 * upload endpoint exists, just an `avatarUrl` string field with nothing to
 * populate it from.
 *
 * "Delete" is real now too, but it *requests* deletion (7-day grace
 * period, cancellable) rather than deleting on the spot — see
 * `DeleteAccountDialog`. A pending request shows as a banner up top with
 * its own Cancel action, sourced straight from the profile response
 * (`deletionRequestedAt`/`deletionScheduledAt`) rather than separate state.
 */
function PersonalInformationCard() {
	const { data: profile, isLoading, isError, error } = useProfile();
	const [isEditing, setIsEditing] = useState(false);
	const updateProfile = useUpdateProfile();
	const cancelDeletion = useCancelAccountDeletion();
	const form = useForm<ProfileValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: profile
			? toFormValues(profile)
			: { firstName: "", lastName: "", otherName: "", username: "" },
	});

	// The form initializes before the query resolves — its first real
	// values arrive via this effect rather than `defaultValues`.
	useEffect(() => {
		if (profile) form.reset(toFormValues(profile));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile]);

	if (isLoading) return <CardSkeleton />;

	if (isError || !profile) {
		return (
			<div className="flex flex-col gap-2 lg:rounded-2xl lg:border lg:border-border lg:bg-background lg:p-6">
				<h2 className="text-s1 text-foreground">Personal Information</h2>
				<p className="text-b3 text-muted-foreground">
					{getApiErrorMessage(error, "Couldn't load your profile.")}
				</p>
			</div>
		);
	}

	const fullName = `${profile.firstName} ${profile.lastName}`.trim();
	const isPendingDeletion = Boolean(profile.deletionRequestedAt);

	function handleChangeProfile() {
		toast.info("Photo upload isn't available yet");
	}

	function handleCancel() {
		form.reset(toFormValues(profile!));
		setIsEditing(false);
	}

	function handleSave(values: ProfileValues) {
		updateProfile.mutate(values, {
			onSuccess: () => {
				toast.success("Profile updated");
				setIsEditing(false);
			},
			onError: (error) => {
				toast.error(getApiErrorMessage(error, "Couldn't update profile"));
			},
		});
	}

	function handleCancelDeletion() {
		cancelDeletion.mutate(undefined, {
			onSuccess: () => toast.success("Account deletion cancelled"),
			onError: (error) => {
				toast.error(getApiErrorMessage(error, "Couldn't cancel account deletion"));
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
				{/* Desktop-only, matching the mock — the mobile version has no
				    section heading, just the avatar straight into the fields. */}
				<h2 className="hidden text-s1 text-foreground lg:block">Personal Information</h2>

				{isPendingDeletion && (
					<div className="flex flex-col items-start gap-2 rounded-xl border border-danger-200 bg-danger-50 p-4">
						<span className="text-b3 font-semibold text-destructive">
							Account scheduled for deletion
						</span>
						<p className="text-c1 text-muted-foreground">
							Your account will be deleted on{" "}
							{new Date(profile.deletionScheduledAt!).toLocaleDateString(undefined, {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
							. You can cancel any time before then.
						</p>
						<Button
							type="button"
							variant="outline"
							size="small"
							loading={cancelDeletion.isPending}
							onClick={handleCancelDeletion}
						>
							Cancel Deletion
						</Button>
					</div>
				)}

				<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
					<div className="flex flex-col items-center gap-3">
						<UserAvatar name={fullName} className="size-20 text-h5" />
						<Button type="button" size="small" onClick={handleChangeProfile}>
							Change Profile
						</Button>
					</div>

					<div className="flex flex-1 flex-col gap-4">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input readOnly={!isEditing} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input readOnly={!isEditing} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="otherName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Other Name (optional)</FormLabel>
									<FormControl>
										<Input readOnly={!isEditing} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input readOnly={!isEditing} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Not part of `profileSchema` — permanently read-only, no
						    endpoint accepts a change to either. */}
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="profile-email">Email</Label>
							<Input id="profile-email" type="email" value={profile.email} readOnly />
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="profile-phone">Phone Number</Label>
							<Input id="profile-phone" value={profile.phoneNumber} readOnly />
						</div>

						<div className="flex gap-3 pt-2">
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
									<Button type="submit" className="flex-1" loading={updateProfile.isPending}>
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
									{!isPendingDeletion && (
										<DeleteAccountDialog>
											<Button type="button" variant="destructive" className="flex-1">
												Delete
											</Button>
										</DeleteAccountDialog>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}

export { PersonalInformationCard };
