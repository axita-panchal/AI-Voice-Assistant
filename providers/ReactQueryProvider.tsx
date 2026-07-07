"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { ReactNode, useEffect, useState } from "react";
import { TOKEN_REFRESHED_EVENT } from "@/services/http";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            const status = (error as any)?.response?.status;

            // 401s are handled by the axios interceptor — suppress UI errors.
            if (status === 401) return;

            if (query.state.data !== undefined) {
              enqueueSnackbar(
                "Failed to sync fresh data. Displaying cached version.",
                { variant: "warning", preventDuplicate: true },
              );
            } else {
              enqueueSnackbar(
                (error as any)?.response?.data?.message ||
                  (error as any)?.message ||
                  "Network error. Failed to load data.",
                { variant: "error", preventDuplicate: true },
              );
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 0,           // always consider data stale so refetch works
            gcTime: 5 * 60 * 1000, // keep cache for 5 min
            refetchOnWindowFocus: false,
            // Zero retries — the axios interceptor handles 401 retries itself.
            // Any React Query retry would race against the interceptor and lose.
            retry: 0,
          },
        },
      }),
  );

  useEffect(() => {
    const handleTokenRefreshed = () => {
      // resetQueries clears the error state AND triggers a fresh fetch,
      // unlike invalidateQueries which only marks stale (queries in error
      // state don't automatically re-fetch on invalidation alone).
      queryClient.resetQueries();
    };

    window.addEventListener(TOKEN_REFRESHED_EVENT, handleTokenRefreshed);
    return () => {
      window.removeEventListener(TOKEN_REFRESHED_EVENT, handleTokenRefreshed);
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {children}
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
