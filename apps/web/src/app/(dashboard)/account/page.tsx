"use client";

import { LogOut } from "lucide-react";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PersonalInformationCard } from "@/features/profile/components/PersonalInformationCard";
import { TwoFactorAuthCard } from "@/features/profile/components/TwoFactorAuthCard";
import { InstallAppCard } from "@/features/profile/components/InstallAppCard";
import { WalletAddressCard } from "@/features/wallet/components/WalletAddressCard";
import { useLogout } from "@/features/auth/hooks";
import { useAuthStore } from "@/lib/stores/authStore";

// Profile and Settings used to be two separate (half-empty) destinations —
// merged into one Account page/nav item, per the actual usage: nothing
// settings-specific existed yet beyond what already lives here.
export default function AccountPage() {
	const logout = useLogout();
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			{/* No `MobileStepHeader` for merchant — `MerchantMobileTopBar` already
			    shows "Account" as a back+title+hamburger bar for this exact
			    route; rendering both stacked "Account"/"Account" bars was a real
			    duplicate-header bug. Individual still needs its own (no back
			    arrow there either — primary bottom-tab destination, same as
			    /wallet — and no equivalent top bar exists for that account type). */}
			{!isMerchant && <MobileStepHeader title="Account" />}
			<PageHeader title="Account" subtitle="Manage your account and settings" />

			<PersonalInformationCard />
			<TwoFactorAuthCard />
			<InstallAppCard />
			<WalletAddressCard />

			{/* Not part of the provided mock — desktop already has Logout in the
			    Sidebar, but mobile has no equivalent nav chrome, so this stays as
			    a low-emphasis fallback rather than dropping mobile logout
			    entirely. */}
			<button
				type="button"
				onClick={logout}
				className="flex items-center justify-center gap-2 self-center text-b3 font-medium text-destructive hover:underline lg:hidden"
			>
				<LogOut className="size-4" aria-hidden="true" />
				Logout
			</button>
		</div>
	);
}
