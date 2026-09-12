"use client";

import { User, Store, HelpCircle, Headphones } from "lucide-react";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { Button } from "@repo/ui/button";
import { Separator } from "@repo/ui/separator";
import { AccountTabs, type AccountTab } from "@/components/layouts/AccountTabs";
import { UserAvatar } from "@/features/dashboard/components/UserAvatar";
import { WalletAddressCard } from "@/features/wallet/components/WalletAddressCard";
import {
	PersonalInformationTab,
	PersonalInformationFields,
} from "@/features/profile/components/PersonalInformationTab";
import { BusinessInformationTab } from "@/features/business/components/BusinessInformationTab";
import { AccountSettingsTab } from "@/features/profile/components/AccountSettingsTab";
import { SettingsRow } from "@/features/profile/components/SettingsRow";
import { MobileInfoSheet } from "@/features/profile/components/MobileInfoSheet";
import { useProfile } from "@/features/profile/hooks";
import { useAuthStore } from "@/lib/stores/authStore";
import { toast } from "@repo/ui/sonner";

/**
 * Two genuinely different layouts, not one responsively-scaled page — same
 * split `DashboardLayout` itself uses. Desktop (`lg` and up): a left
 * mini-nav (`AccountTabs`) switching between Personal Information,
 * [Business Information, merchant only], and Account Settings, each its
 * own panel — no page-level heading above it, matching the mock (every
 * desktop reference screen goes straight from the topbar into the tabs).
 * Mobile: one scrolling "Profile" page — avatar/wallet header once at the
 * top (not repeated inside each sheet), then Personal Information/Business
 * Information as rows opening a bottom sheet (`MobileInfoSheet`) instead of
 * a separate route, then Help & Support (FAQ/Contact Support — mobile-only,
 * no desktop equivalent in any reference screen), then the same
 * `AccountSettingsTab` content desktop's own tab shows, reused as a plain
 * section here rather than duplicated.
 *
 * Nav labels differ from this page's own title deliberately — desktop's
 * sidebar item reads "Accounts", the mobile bottom tab reads "Profile"
 * (see `Sidebar`/`MerchantNavList`/`BottomTabBar`), both matching their own
 * mock exactly; the route itself stays `/account` either way.
 */
export default function AccountPage() {
	const isMerchant = useAuthStore((state) => state.customerType === "merchant");
	const { data: profile } = useProfile();

	const tabs: AccountTab[] = [
		{ key: "personal", label: "Personal Information", content: <PersonalInformationTab /> },
		...(isMerchant
			? [
					{
						key: "business",
						label: "Business Information",
						content: <BusinessInformationTab />,
					},
				]
			: []),
		{ key: "settings", label: "Account Settings", content: <AccountSettingsTab /> },
	];

	function handleChangeProfile() {
		toast.info("Photo upload isn't available yet");
	}

	return (
		<div className="flex flex-1 flex-col gap-6">
			{/* No `MobileStepHeader` for merchant — `MerchantMobileTopBar` already
			    shows this route's own nav-item label ("Accounts") as a
			    back+title+hamburger bar; rendering both stacked was a real
			    duplicate-header bug on this exact page before. Individual still
			    needs its own — no equivalent top bar exists for that account
			    type, and this is a primary bottom-tab destination (no back
			    arrow), titled "Profile" to match the mock and the tab's own
			    renamed label. */}
			{!isMerchant && <MobileStepHeader title="Profile" />}

			{/* Desktop */}
			<AccountTabs tabs={tabs} />

			{/* Mobile */}
			<div className="flex flex-col gap-6 lg:hidden">
				<div className="flex flex-col items-center gap-3">
					<UserAvatar
						name={profile ? `${profile.firstName} ${profile.lastName}`.trim() : ""}
						className="size-20 text-h5"
					/>
					<Button type="button" size="small" onClick={handleChangeProfile}>
						Change Profile
					</Button>
				</div>

				<WalletAddressCard />

				<div className="flex flex-col divide-y divide-border">
					<MobileInfoSheet
						title="Personal Information"
						trigger={<SettingsRow icon={User} label="Personal Information" />}
					>
						<PersonalInformationFields />
					</MobileInfoSheet>

					{isMerchant && (
						<MobileInfoSheet
							title="Business Information"
							trigger={<SettingsRow icon={Store} label="Business Information" />}
						>
							<BusinessInformationTab />
						</MobileInfoSheet>
					)}
				</div>

				<Separator />

				<div className="flex flex-col gap-2">
					<span className="text-c1 font-semibold text-muted-foreground uppercase">
						Help &amp; Support
					</span>
					<div className="flex flex-col divide-y divide-border">
						<SettingsRow href="/support/faq" icon={HelpCircle} label="FAQ" />
						<SettingsRow href="/support/contact" icon={Headphones} label="Contact Support" />
					</div>
				</div>

				<Separator />

				<div className="flex flex-col gap-2">
					<span className="text-c1 font-semibold text-muted-foreground uppercase">
						Account Settings
					</span>
					<AccountSettingsTab />
				</div>
			</div>
		</div>
	);
}
