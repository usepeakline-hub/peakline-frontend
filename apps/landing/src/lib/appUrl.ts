/**
 * apps/landing is its own deployment (own domain/port), but auth still lives
 * in apps/web (see root CLAUDE.md) — every "Log in" / "Get Started" CTA here
 * has to cross apps, not route internally. `NEXT_PUBLIC_APP_URL` should point
 * at the deployed apps/web origin; falls back to its local dev port (3000)
 * so this resolves correctly without extra setup during local development.
 */
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function appUrl(path: string): string {
	return `${APP_URL}${path}`;
}

export { appUrl };
