"use client";

import { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { toast } from "@repo/ui/sonner";
import { getApiErrorMessage } from "@/lib/api/errorMessage";
import { useRequestAccountDeletion } from "@/features/profile/hooks";

interface DeleteAccountDialogProps {
	children: React.ReactNode;
}

/**
 * Confirms *requesting* deletion, not deleting on the spot —
 * `POST /users/me/deletion-request` schedules it 7 days out, cancellable
 * any time before then (see the pending-deletion banner
 * `PersonalInformationCard` shows once this succeeds). The confirm copy
 * says so explicitly rather than reading like an immediate, irreversible
 * delete.
 */
function DeleteAccountDialog({ children }: DeleteAccountDialogProps) {
	const [open, setOpen] = useState(false);
	const requestDeletion = useRequestAccountDeletion();

	function handleConfirm() {
		requestDeletion.mutate(undefined, {
			onSuccess: () => {
				toast.success("Account deletion scheduled");
				setOpen(false);
			},
			onError: (error) => {
				toast.error(getApiErrorMessage(error, "Couldn't schedule account deletion"));
			},
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete your account?</DialogTitle>
					<DialogDescription>
						Your account will be deleted in 7 days. You can cancel any time
						before then from this same page — nothing is lost until the grace
						period ends.
					</DialogDescription>
				</DialogHeader>
				<div className="flex gap-3">
					<DialogClose asChild>
						<Button type="button" variant="outline" className="flex-1">
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="button"
						variant="destructive"
						className="flex-1"
						loading={requestDeletion.isPending}
						onClick={handleConfirm}
					>
						Delete Account
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export { DeleteAccountDialog };
