"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Logo } from "@repo/ui/logo";
import { Button } from "@repo/ui/button";
import { appUrl } from "@/lib/appUrl";

/** Figma's exact hamburger glyph (3 unequal-width bars) — not lucide's
 * `Menu` (3 equal bars), per the asset the user provided. */
function HamburgerIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6 1C6 0.447715 6.44771 0 7 0H15C15.5523 0 16 0.447715 16 1C16 1.55228 15.5523 2 15 2H7C6.44771 2 6 1.55228 6 1ZM0 6C0 5.44771 0.447715 5 1 5H15C15.5523 5 16 5.44771 16 6C16 6.55228 15.5523 7 15 7H1C0.447715 7 0 6.55228 0 6ZM0 11C0 10.4477 0.447715 10 1 10H9C9.55228 10 10 10.4477 10 11C10 11.5523 9.55228 12 9 12H1C0.447715 12 0 11.5523 0 11Z"
				fill="currentColor"
			/>
		</svg>
	);
}

const NAV_LINKS = [
	{ label: "Home", href: "#" },
	{ label: "About", href: "#about" },
	{ label: "How it works", href: "#how-it-works" },
	{ label: "Services", href: "#services" },
];

/**
 * Floating dark pill over the hero background (Figma "Navbar", #418:4821) —
 * not a full-width bar, and not sticky (nothing in the fetched frame data
 * indicated scroll-pinning). Below `lg`, the export collapses the links +
 * both auth CTAs into a single menu toggle (the reference mobile screenshot
 * shows only the logo and a green circular hamburger button) — there's no
 * separate mobile-menu frame in the fetched Figma data, so the open state
 * (a stacked panel with the same links/CTAs) is this component's own design,
 * not a 1:1 trace.
 */
function Navbar() {
	const [open, setOpen] = useState(false);

	return (
		<nav className="relative mx-auto w-full max-w-[1240px]">
			<div className="flex items-center justify-between gap-6 rounded-full bg-neutral-900 px-4 py-3 sm:px-8">
				<Link href="/" aria-label="Peakline home">
					{/* Figma's navbar logo export is 117×39 at the 1440 desktop
					 * frame — noticeably bigger than @repo/ui/logo's preset size
					 * steps, so this is a direct height override rather than a
					 * named size. */}
					<Logo variant="dark" className="h-8 sm:h-[39px]" />
				</Link>

				<div className="hidden items-center gap-10 lg:flex">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className="text-b1 text-white/90 transition-colors hover:text-white"
						>
							{link.label}
						</Link>
					))}
				</div>

				<div className="hidden items-center gap-5 lg:flex">
					<Button
						asChild
						variant="outline"
						size="medium"
						className="rounded-full border-secondary-500 bg-transparent text-white hover:bg-white/10"
					>
						<Link href={appUrl("/auth/sign-in")}>Log in</Link>
					</Button>
					<Button asChild variant="primary" size="medium" className="rounded-full">
						<Link href={appUrl("/auth/sign-up")}>Get Started</Link>
					</Button>
				</div>

				<Button
					variant="primary"
					size="medium"
					iconOnly
					aria-label={open ? "Close menu" : "Open menu"}
					aria-expanded={open}
					onClick={() => setOpen((v) => !v)}
					className="rounded-full lg:hidden"
				>
					{open ? <X className="size-5" aria-hidden="true" /> : <HamburgerIcon className="size-4" aria-hidden="true" />}
				</Button>
			</div>

			{open && (
				<div className="absolute inset-x-0 top-[calc(100%+8px)] z-20 flex flex-col gap-1 rounded-3xl bg-neutral-900 p-4 lg:hidden">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							onClick={() => setOpen(false)}
							className="rounded-xl px-4 py-3 text-b1 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
						>
							{link.label}
						</Link>
					))}
					<div className="mt-2 flex flex-col gap-3 px-4">
						<Button
							asChild
							variant="outline"
							size="medium"
							className="rounded-full border-secondary-500 bg-transparent text-white hover:bg-white/10"
						>
							<Link href={appUrl("/auth/sign-in")}>Log in</Link>
						</Button>
						<Button asChild variant="primary" size="medium" className="rounded-full">
							<Link href={appUrl("/auth/sign-up")}>Get Started</Link>
						</Button>
					</div>
				</div>
			)}
		</nav>
	);
}

export { Navbar };
