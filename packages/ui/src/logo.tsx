import logoSrc from "./assets/logo.svg";
import { cn } from "./lib/utils";

/**
 * Plain <img>, not next/image — this file is bundled into every app that
 * imports it, and `next/image` isn't resolvable from inside this package
 * under pnpm's strict linking (see CLAUDE.md). Wrap it in your own
 * `next/link` where you need it to be clickable.
 */
const SIZE_CLASS = {
	sm: "h-5",
	md: "h-7",
	lg: "h-8 sm:h-13",
	xl: "h-15",
} as const;

interface LogoProps extends Omit<React.ComponentProps<"img">, "src" | "alt"> {
	size?: keyof typeof SIZE_CLASS;
}

function Logo({ size = "md", className, ...props }: LogoProps) {
	return (
		<img
			src={logoSrc.src}
			alt="Peakline"
			className={cn("w-auto", SIZE_CLASS[size], className)}
			{...props}
		/>
	);
}

export { Logo };
export type { LogoProps };
