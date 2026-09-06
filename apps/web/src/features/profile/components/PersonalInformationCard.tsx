"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
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
import { useUpdateProfile } from "@/features/profile/hooks";
import { profileSchema, type ProfileValues } from "@/lib/validations/profileValidations";

// TODO: source from the authenticated session once one exists — kept as
// the same "John Doe" identity used everywhere else in the app (Topbar,
// GreetingHeader, Send's fake recipient) rather than the differing sample
// names ("Kwame Doe" on the Receive mock, "Kwame Mensah" on this one) —
// one consistent fake person, so the app doesn't contradict itself about
// who's signed in.
const DEFAULT_VALUES: ProfileValues = {
	username: "john_doe",
	fullName: "John Doe",
	email: "johndoe@example.com",
	phone: "+233 24 123 4567",
};

/**
 * Fields render as read-only (normal input styling, just not editable —
 * `readOnly`, not `disabled`, which would gray them out and not match the
 * mock's plain-input look) until "Edit" is pressed. "Change Profile" and
 * "Delete" are honest stubs (toast, no fake success) — there's no upload
 * or account-deletion backend to call yet.
 */
function PersonalInformationCard() {
	const [isEditing, setIsEditing] = useState(false);
	const updateProfile = useUpdateProfile();
	const form = useForm<ProfileValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: DEFAULT_VALUES,
	});

	function handleChangeProfile() {
		toast.info("Photo upload isn't available yet");
	}

	function handleDelete() {
		toast.info("Account deletion isn't available yet");
	}

	function handleCancel() {
		form.reset(DEFAULT_VALUES);
		setIsEditing(false);
	}

	function handleSave(values: ProfileValues) {
		updateProfile.mutate(values, {
			onSuccess: () => {
				toast.success("Profile updated");
				setIsEditing(false);
			},
		});
	}

	return (
		<Form {...form}>
			<form
				noValidate
				onSubmit={form.handleSubmit(handleSave)}
				className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8 lg:rounded-2xl lg:border lg:border-border lg:bg-background lg:p-6"
			>
				<div className="flex flex-col items-center gap-3">
					<UserAvatar name={DEFAULT_VALUES.fullName} className="size-20 text-h5" />
					<Button type="button" size="small" onClick={handleChangeProfile}>
						Change Profile
					</Button>
				</div>

				<div className="flex flex-1 flex-col gap-4">
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
					<FormField
						control={form.control}
						name="fullName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input readOnly={!isEditing} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" readOnly={!isEditing} {...field} />
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
									<Input readOnly={!isEditing} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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
								<Button
									type="button"
									variant="destructive"
									className="flex-1"
									onClick={handleDelete}
								>
									Delete
								</Button>
							</>
						)}
					</div>
				</div>
			</form>
		</Form>
	);
}

export { PersonalInformationCard };
