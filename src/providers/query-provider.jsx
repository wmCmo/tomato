import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 4 * 60 * 1000, // 4 min
            gcTime: 35 * 60 * 1000 // 35 min
        },
        mutations: {
            retry: false
        }
    }
});

export default function QueryProvider({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
