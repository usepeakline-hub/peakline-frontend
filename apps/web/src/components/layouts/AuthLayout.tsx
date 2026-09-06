"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@repo/ui/logo";
import authIllustration from "@repo/ui/assets/illustrations/auth/auth-illustration.webp";
import tellUsAboutYourselfIllustration from "@repo/ui/assets/illustrations/auth/tell-us-about-yourself-illustration.svg";

type AuthHeader =
	| { kind: "switch"; prompt: string; label: string; href: string }
	| { kind: "back" };

const SIGN_IN_SWITCH: AuthHeader = {
	kind: "switch",
	prompt: "Already have an account?",
	label: "Log in",
	href: "/auth/sign-in",
};

/**
 * Per-route chrome for every /auth/* screen: the top-right header content —
 * the "Already have an account?" switch link on most screens (confirmed
 * verbatim by the 2FA method screenshot, 150:3004 — it's shown even mid-login,
 * not context-aware), a "Back" link only where the actual Figma (127:2709)
 * shows one instead — and which side illustration shows next to the form, or
 * none for Verify's centered layout. Keyed by pathname so individual pages
 * don't each render their own copy of this.
 */
const AUTH_ROUTES: Record<
	string,
	{ header?: AuthHeader; illustration: typeof authIllustration | null }
> = {
	"/auth/sign-up": { header: SIGN_IN_SWITCH, illustration: authIllustration },
	"/auth/sign-in": {
		header: {
			kind: "switch",
			prompt: "Don't have an account?",
			label: "Sign up",
			href: "/auth/sign-up",
		},
		illustration: authIllustration,
	},
	"/auth/sign-up/account-type": {
		header: SIGN_IN_SWITCH,
		illustration: authIllustration,
	},
	"/auth/sign-up/merchant-setup": {
		header: SIGN_IN_SWITCH,
		illustration: authIllustration,
	},
	"/auth/sign-up/personal-details": {
		header: SIGN_IN_SWITCH,
		illustration: tellUsAboutYourselfIllustration,
	},
	"/auth/sign-up/personal-details/id-verification": {
		header: SIGN_IN_SWITCH,
		illustration: tellUsAboutYourselfIllustration,
	},
	"/auth/sign-up/personal-details/review": {
		header: SIGN_IN_SWITCH,
		illustration: tellUsAboutYourselfIllustration,
	},
	"/auth/sign-up/verify-otp": {
		header: { kind: "back" },
		illustration: null,
	},
	"/auth/sign-up/set-pin": {
		illustration: authIllustration,
	},
	"/auth/sign-up/success": {
		header: { kind: "back" },
		illustration: null,
	},
	"/auth/sign-in/two-factor": {
		header: SIGN_IN_SWITCH,
		illustration: authIllustration,
	},
	"/auth/sign-in/verify": {
		header: { kind: "back" },
		illustration: null,
	},
	"/auth/forgot-password": {
		header: { kind: "back" },
		illustration: authIllustration,
	},
	"/auth/reset-password": {
		header: { kind: "back" },
		illustration: authIllustration,
	},
};

function AuthLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const route = AUTH_ROUTES[pathname];
	const header = route?.header;
	const illustration = route ? route.illustration : authIllustration;

	return (
		<div className="min-h-screen pt-8 sm:pt-10 pb-20">
			<div className="mx-auto max-w-300 px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between gap-4 md:pb-10">
					<Logo size="lg" className="shrink-0" />
					{header?.kind === "switch" && (
						<p className="min-w-0 text-right text-b3 text-muted-foreground">
							<span className="max-md:hidden">{header.prompt} </span>
							<Link
								href={header.href}
								className="font-medium text-primary hover:underline"
							>
								{header.label}
							</Link>
						</p>
					)}
					{header?.kind === "back" && (
						<button
							type="button"
							onClick={() => router.back()}
							className="text-b3 text-muted-foreground hover:text-foreground"
						>
							Back
						</button>
					)}
				</div>

				{illustration ? (
					<div className="flex justify-between gap-10">
						<div className="flex-1">
							<div className="mt-10 sm:mt-15 max-w-120 max-lg:mx-auto">
								{children}
							</div>
						</div>
						<div className="hidden shrink-0 lg:block lg:w-80 xl:w-96">
							<Image
								src={illustration}
								alt=""
								sizes="(min-width: 1280px) 24rem, 20rem"
								className="h-auto w-full"
							/>
						</div>
					</div>
				) : (
					<div className="mx-auto mt-10 max-w-120 sm:mt-15">{children}</div>
				)}
			</div>
		</div>
	);
}

export { AuthLayout };
