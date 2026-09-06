import { cn } from "@repo/ui/lib/utils";

function initials(name: string) {
	const parts = name.trim().split(/\s+/);
	return `${parts[0]?.[0] ?? ""}${parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : ""}`.toUpperCase();
}

/** Initials-based avatar — shared by the desktop Topbar and the mobile
 * greeting row (no photo asset exists yet). */
function UserAvatar({ name, className }: { name: string; className?: string }) {
	return (
		<span
			className={cn(
				"flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-c2 font-semibold text-primary-800",
				className,
			)}
		>
			{initials(name)}
		</span>
	);
}

export { UserAvatar };
