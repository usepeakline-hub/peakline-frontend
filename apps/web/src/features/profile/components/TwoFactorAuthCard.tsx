"use client";

import { ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { useAccountSettingsStore } from "@/lib/stores/accountSettingsStore";
import { TwoFactorEnrollDialog } from "@/features/profile/components/TwoFactorEnrollDialog";
import { TwoFactorDisableDialog } from "@/features/profile/components/TwoFactorDisableDialog";

/**
 * Lets an account turn 2FA on or off from settings — real now
 * (`POST /auth/2fa/enroll` + `/confirm`, `DELETE /auth/2fa`), via
 * `TwoFactorEnrollDialog`/`TwoFactorDisableDialog`. There's no
 * "is 2FA enabled" endpoint to check against, so `has2FA` stays a
 * persisted local flag (`accountSettingsStore`) updated only once the real
 * enroll/disable call actually succeeds — not optimistically.
 *
 * The login flow's own 2FA step (Sign In → method picker → verify) is a
 * separate, not-yet-updated flow — it predates this endpoint group and
 * offers an "Email" method this TOTP-only backend has no equivalent for.
 * Left untouched here; needs its own pass.
 */
function TwoFactorAuthCard() {
	const has2FA = useAccountSettingsStore((state) => state.has2FA);
	const setHas2FA = useAccountSettingsStore((state) => state.setHas2FA);

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
				<TwoFactorDisableDialog onDisabled={() => setHas2FA(false)}>
					<Button type="button" variant="outline" size="small" className="shrink-0">
						Disable
					</Button>
				</TwoFactorDisableDialog>
			) : (
				<TwoFactorEnrollDialog onEnabled={() => setHas2FA(true)}>
					<Button type="button" size="small" className="shrink-0">
						Enable
					</Button>
				</TwoFactorEnrollDialog>
			)}
		</div>
	);
}

export { TwoFactorAuthCard };
