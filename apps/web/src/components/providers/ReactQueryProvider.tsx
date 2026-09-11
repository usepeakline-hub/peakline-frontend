"use client";

import { useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/lib/api/errorMessage";

// Belt-and-suspenders alongside `lib/config/axios.ts`'s own request/response
// logging: that covers every HTTP call, but a queryFn/mutationFn can also
// fail *before* ever reaching axios (a thrown validation error, a bad
// `.find()` on a still-loading dependency, `useMyWallet` finding no wallet
// then something downstream not expecting `null`, ...) — those would
// otherwise settle a query into its `error` state completely silently. This
// logs every one of them, HTTP-backed or not, so nothing fails without a
// trace and a query stuck on a spinner always has a matching console line
// explaining why it stopped.
const queryCache = new QueryCache({
	onError: (error, query) => {
		console.error(
			`%c[query] %c${JSON.stringify(query.queryKey)}`,
			"color:#dc2626;font-weight:600",
			"color:inherit",
			"—",
			getApiErrorMessage(error, error instanceof Error ? error.message : "Unknown error"),
			error,
		);
	},
});

const mutationCache = new MutationCache({
	onError: (error, _variables, _context, mutation) => {
		console.error(
			`%c[mutation] %c${mutation.options.mutationKey ? JSON.stringify(mutation.options.mutationKey) : "(unkeyed)"}`,
			"color:#dc2626;font-weight:600",
			"color:inherit",
			"—",
			getApiErrorMessage(error, error instanceof Error ? error.message : "Unknown error"),
			error,
		);
	},
});

function ReactQueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache,
				mutationCache,
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						retry: 1,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

export { ReactQueryProvider };
