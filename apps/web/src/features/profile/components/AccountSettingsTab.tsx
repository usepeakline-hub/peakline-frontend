"use client";

import { ShieldCheck, FileText, Lock, KeyRound, LogOut, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { toast } from "@repo/ui/sonner";
import { Separator } from "@repo/ui/separator";
import { getApiErrorMessage } from "@/lib/api/errorMessage";
import { useProfile, useCancelAccountDeletion } from "@/features/profile/hooks";
import { SettingsRow } from "@/features/profile/components/SettingsRow";
import { TwoFactorSettingRow } from "@/features/profile/components/TwoFactorSettingRow";
import { ChangePinDialog } from "@/features/profile/components/ChangePinDialog";
import { ChangePasswordDialog } from "@/features/profile/components/ChangePasswordDialog";
import { DeleteAccountDialog } from "@/features/profile/components/DeleteAccountDialog";
import { InstallAppCard } from "@/features/profile/components/InstallAppCard";
import { LogoutConfirmDialog } from "@/components/layouts/LogoutConfirmDialog";

/**
 * The Account Settings tab/section — every row from the mock (2FA, Terms,
 * Privacy, Change PIN, Change Password, Logout, Delete Account), shared
 * between the desktop tab and the mobile Profile page's own "Account
 * Settings" section (see `AccountPage`). "Delete Account" and the
 * pending-deletion banner both live here now, not on Personal Information
 * (see that tab's own note on the split).
 *
 * `InstallAppCard` isn't part of any mock — real, working PWA-install
 * functionality with nowhere in the new design to go, so it's tucked in
 * below the mock's own rows rather than dropped.
 */
function AccountSettingsTab() {
	const { data: profile, isLoading } = useProfile();
	const cancelDeletion = useCancelAccountDeletion();
	const isPendingDeletion = Boolean(profile?.deletionRequestedAt);

	function handleCancelDeletion() {
		cancelDeletion.mutate(undefined, {
			onSuccess: () => toast.success("Account deletion cancelled"),
			onError: (error) => {
				toast.error(getApiErrorMessage(error, "Couldn't cancel account deletion"));
			},
		});
	}

	return (
		<div className="flex flex-col gap-6">
			{isLoading ? (
				<Skeleton className="h-11 w-full" />
			) : (
				isPendingDeletion && (
					<div className="flex flex-col items-start gap-2 rounded-xl border border-danger-200 bg-danger-50 p-4">
						<span className="text-b3 font-semibold text-destructive">
							Account scheduled for deletion
						</span>
						<p className="text-c1 text-muted-foreground">
							Your account will be deleted on{" "}
							{new Date(profile!.deletionScheduledAt!).toLocaleDateString(undefined, {
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
				)
			)}

			<div className="flex flex-col divide-y divide-border">
				<TwoFactorSettingRow />

				<SettingsRow href="/legal/terms" icon={ShieldCheck} label="Terms and Conditions" />

				<SettingsRow href="/legal/privacy" icon={FileText} label="Privacy Policy" />

				<ChangePinDialog>
					<SettingsRow icon={Lock} label="Change Transaction PIN" destructive />
				</ChangePinDialog>

				<ChangePasswordDialog>
					<SettingsRow icon={KeyRound} label="Change Password" destructive />
				</ChangePasswordDialog>

				<LogoutConfirmDialog>
					<SettingsRow icon={LogOut} label="Logout" destructive />
				</LogoutConfirmDialog>

				{!isPendingDeletion && (
					<DeleteAccountDialog>
						<SettingsRow icon={Trash2} label="Delete Account" destructive />
					</DeleteAccountDialog>
				)}
			</div>

			<Separator />

			<InstallAppCard />
		</div>
	);
}

export { AccountSettingsTab };
