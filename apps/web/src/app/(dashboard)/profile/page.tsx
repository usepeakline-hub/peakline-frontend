"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PersonalInformationCard } from "@/features/profile/components/PersonalInformationCard";
import { WalletAddressCard } from "@/features/wallet/components/WalletAddressCard";
import { useLogout } from "@/features/auth/hooks";

export default function ProfilePage() {
	const router = useRouter();
	const logout = useLogout();

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader title="Profile" onBack={() => router.back()} />
			<PageHeader title="Profile" subtitle="Manage your account information" />

			<PersonalInformationCard />
			<WalletAddressCard />

			{/* Not part of the provided mock — desktop already has Logout in the
			    Sidebar, but mobile has no equivalent nav chrome, so this stays as
			    a low-emphasis fallback rather than dropping mobile logout
			    entirely. Easy to remove if it's meant to live in Settings instead. */}
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
