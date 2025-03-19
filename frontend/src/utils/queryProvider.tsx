"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 24 * 60 * 60 * 1000, // 1 day
            refetchOnWindowFocus: false,
            gcTime: 24 * 60 * 60 * 1000 // 1 day
        }
    }
});

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

export default ReactQueryProvider;