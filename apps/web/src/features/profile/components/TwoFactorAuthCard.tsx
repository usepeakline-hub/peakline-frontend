"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "@repo/ui/button";
import { toast } from "@repo/ui/sonner";
import { cn } from "@repo/ui/lib/utils";
import { useAccountSettingsStore } from "@/lib/stores/accountSettingsStore";
import { useLoginFlowStore } from "@/lib/stores/loginFlowStore";

// TODO: source from the authenticated session once one exists — same
// placeholder used everywhere else (Topbar, GreetingHeader, Account).
const CURRENT_USER_EMAIL = "johndoe@example.com";

/**
 * Lets an account turn 2FA on or off outside of the login flow — per the
 * "optional, not mandatory" change, this is the one place it can be
 * enabled if the sign-in prompt was skipped. "Enable" reuses the same
 * method-picker + verify sequence Sign In uses when 2FA is already on; that
 * flow lives under /auth (shared with Sign In) and guards on
 * `loginFlowStore` having an email, so this sets one first the same way a
 * real sign-in would.
 */
function TwoFactorAuthCard() {
	const router = useRouter();
	const has2FA = useAccountSettingsStore((state) => state.has2FA);
	const setHas2FA = useAccountSettingsStore((state) => state.setHas2FA);
	const setLoginEmail = useLoginFlowStore((state) => state.setEmail);

	function handleEnable() {
		setLoginEmail(CURRENT_USER_EMAIL);
		router.push("/auth/sign-in/two-factor");
	}

	function handleDisable() {
		setHas2FA(false);
		toast.success("2-factor authentication turned off");
	}

	return (
		<div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 sm:p-6">
			<div className="flex items-center gap-4">
				<span
					className={cn(
						"flex size-11 shrink-0 items-center justify-center rounded-full",
						has2FA ? "bg-primary-500/10" : "bg-neutral-100",
					)}
				>
					{has2FA ? (
						<ShieldCheck className="size-5 text-primary-600" aria-hidden="true" />
					) : (
						<ShieldOff className="size-5 text-muted-foreground" aria-hidden="true" />
					)}
				</span>
				<div className="flex flex-col">
					<span className="text-b3 font-semibold text-foreground sm:text-b2">
						Two-Factor Authentication
					</span>
					<span className="text-c1 text-muted-foreground sm:text-b3">
						{has2FA
							? "Enabled for your account."
							: "Not enabled — add an extra layer of security."}
					</span>
				</div>
			</div>

			{has2FA ? (
				<Button
					type="button"
					variant="outline"
					size="small"
					className="shrink-0"
					onClick={handleDisable}
				>
					Disable
				</Button>
			) : (
				<Button type="button" size="small" className="shrink-0" onClick={handleEnable}>
					Enable
				</Button>
			)}
		</div>
	);
}

export { TwoFactorAuthCard };
