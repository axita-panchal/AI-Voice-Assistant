"use client";

import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { ReactNode, useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // If we already have data in the cache, keep displaying the stale cache data
        // and notify the user about the background sync failure via a warning snackbar.
        if (query.state.data !== undefined) {
          enqueueSnackbar("Failed to sync fresh data. Displaying cached version.", {
            variant: "warning",
            preventDuplicate: true,
          });
        } else {
          enqueueSnackbar(
            (error as any)?.response?.data?.message || 
            (error as any)?.message || 
            "Network error. Failed to load data.",
            { variant: "error", preventDuplicate: true }
          );
        }
      }
    }),
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: false,
        retry: 1,
      }
    }
  }));

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

