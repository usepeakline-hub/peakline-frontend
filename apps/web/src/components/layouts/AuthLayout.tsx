import Image from "next/image";
import Link from "next/link";
import logo from "@repo/ui/assets/logo.svg";
import authIllustration from "@repo/ui/assets/illustrations/auth/auth-illustration.svg";

/**
 * Shared shell for every auth screen (sign in, sign up, and later verify /
 * personal details / forgot & reset password): the form on the left, a
 * brand illustration panel on the right on larger screens, collapsing to
 * just the form full-width on mobile.
 */
function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-full flex-1 flex-col lg:flex-row">
			<div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:justify-center lg:px-16 xl:px-24">
				<Link href="/" className="mb-10 inline-flex w-fit lg:hidden">
					<Image src={logo} alt="Peakline" className="h-7 w-auto" priority />
				</Link>
				<div className="mx-auto w-full max-w-sm">{children}</div>
			</div>

			<div className="hidden lg:flex lg:w-[42%] lg:flex-col lg:justify-between lg:bg-primary-50 lg:px-12 lg:py-12 xl:px-16">
				<Link href="/" className="inline-flex w-fit">
					<Image src={logo} alt="Peakline" className="h-7 w-auto" priority />
				</Link>
				<div className="flex flex-1 items-center justify-center py-10">
					<Image
						src={authIllustration}
						alt=""
						className="h-auto w-full max-w-sm"
						priority
					/>
				</div>
				<p className="text-h5 max-w-sm text-primary-900">
					One wallet for simple digital payments.
				</p>
			</div>
		</div>
	);
}

export { AuthLayout };
