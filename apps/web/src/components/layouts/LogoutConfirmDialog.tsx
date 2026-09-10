"use client";

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
import { useLogout } from "@/features/auth/hooks";

/**
 * Wraps whichever "Logout" trigger a caller passes in (Sidebar's, the
 * merchant mobile drawer's, Account's own mobile fallback) with a confirm
 * step first — logging out used to fire immediately on click, no
 * second-guess if it was hit by mistake. One shared dialog rather than
 * three copies of the same confirm/cancel markup.
 */
function LogoutConfirmDialog({ children }: { children: React.ReactNode }) {
	const logout = useLogout();

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Log out?</DialogTitle>
					<DialogDescription>
						You&apos;ll need to sign in again to access your account.
					</DialogDescription>
				</DialogHeader>
				<div className="flex gap-3">
					<DialogClose asChild>
						<Button type="button" variant="outline" className="flex-1">
							Cancel
						</Button>
					</DialogClose>
					<Button type="button" variant="destructive" className="flex-1" onClick={logout}>
						Log out
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export { LogoutConfirmDialog };
