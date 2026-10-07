import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute stale time for catalog
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
