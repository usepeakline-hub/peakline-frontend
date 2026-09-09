"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authStore";

/**
 * Hydrates the auth store from the token cookies on first client render.
 * Cookies aren't readable during SSR, so the store's initial state is
 * unauthenticated on both the server and the first client render (avoiding
 * a hydration mismatch) — this patches in the real value right after mount.
 */
function AuthProvider({ children }: { children: React.ReactNode }) {
	const initializeAuth = useAuthStore((state) => state.initializeAuth);

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	return <>{children}</>;
}

export { AuthProvider };
