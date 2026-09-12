"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@repo/ui/logo";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { useLogout } from "@/features/auth/hooks";
import { NAV_GROUPS } from "@/components/layouts/navConfig";

function formatRole(role: string) {
	return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Sidebar() {
	const pathname = usePathname();
	const staffRole = useAuthStore((state) => state.staffRole);

	return (
		<aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-background lg:flex">
			<div className="flex h-16 items-center border-b border-border px-6">
				<Logo size="sm" />
			</div>
			<nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-6">
				{NAV_GROUPS.map((group) => {
					const items = group.items.filter(
						(item) => !item.roles || (staffRole && item.roles.includes(staffRole)),
					);
					if (items.length === 0) return null;
					return (
						<div key={group.label || "root"} className="flex flex-col gap-1">
							{group.label && (
								<span className="px-3 pb-1 text-c3 font-semibold tracking-wide text-muted-foreground uppercase">
									{group.label}
								</span>
							)}
							{items.map((item) => {
								const isActive =
									item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
								return (
									<Link
										key={item.href}
										href={item.href}
										className={cn(
											"flex items-center gap-3 rounded-lg px-3 py-2 text-b3 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
											isActive && "bg-primary-100 text-primary-800 hover:bg-primary-100 hover:text-primary-800",
										)}
									>
										<item.icon className="size-4.5" aria-hidden="true" />
										{item.label}
									</Link>
								);
							})}
						</div>
					);
				})}
			</nav>
		</aside>
	);
}

function Topbar() {
	const email = useAuthStore((state) => state.email);
	const staffRole = useAuthStore((state) => state.staffRole);
	const logout = useLogout();

	return (
		<header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-6 lg:pl-6">
			<div className="lg:hidden">
				<Logo size="sm" />
			</div>
			<div className="hidden lg:block" />
			<div className="flex items-center gap-3">
				{staffRole && <Badge variant="outline">{formatRole(staffRole)}</Badge>}
				<span className="hidden text-b4 text-muted-foreground sm:inline">{email}</span>
				<Button type="button" variant="outline" size="small" onClick={() => logout()}>
					<LogOut className="size-4" aria-hidden="true" />
					Sign Out
				</Button>
			</div>
		</header>
	);
}

/** The ops-console shell — sidebar grouped by domain (see `navConfig`) +
 * topbar with the signed-in staff member's identity/role. Deliberately its
 * own, denser layout rather than reusing anything from apps/web's
 * `DashboardLayout` — this app has a completely different audience and
 * information density, and the two apps don't share a deployment to begin
 * with (see the build plan's own "why a separate app" note). */
function AdminShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen bg-muted">
			<Sidebar />
			<div className="flex flex-1 flex-col lg:ml-64">
				<Topbar />
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}

export { AdminShell };
