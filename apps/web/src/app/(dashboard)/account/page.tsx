"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PersonalInformationCard } from "@/features/profile/components/PersonalInformationCard";
import { WalletAddressCard } from "@/features/wallet/components/WalletAddressCard";
import { useLogout } from "@/features/auth/hooks";

// Profile and Settings used to be two separate (half-empty) destinations —
// merged into one Account page/nav item, per the actual usage: nothing
// settings-specific existed yet beyond what already lives here.
export default function AccountPage() {
	const router = useRouter();
	const logout = useLogout();

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader title="Account" onBack={() => router.back()} />
			<PageHeader title="Account" subtitle="Manage your account and settings" />

			<PersonalInformationCard />
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
