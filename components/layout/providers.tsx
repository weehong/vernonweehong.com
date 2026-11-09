"use client";

import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: { queries: { staleTime: 60 * 1000 } },
	});
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
	if (isServer) return makeQueryClient();
	browserQueryClient ??= makeQueryClient();
	return browserQueryClient;
}

/** Client providers for the whole site (TanStack Query for the forms). */
export function Providers({
	children,
}: {
	readonly children: React.ReactNode;
}): React.ReactElement {
	return (
		<QueryClientProvider client={getQueryClient()}>
			{children}
		</QueryClientProvider>
	);
}
