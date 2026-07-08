import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RenderOptions, render } from "@testing-library/react";
import { SnackbarProvider } from "notistack";
import { ReactElement, ReactNode } from "react";

type ExtendedRenderOptions = Omit<RenderOptions, "wrapper"> & {
  queryClient?: QueryClient;
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { queryClient, ...options }: ExtendedRenderOptions = {},
) {
  const client = queryClient ?? createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
      </QueryClientProvider>
    );
  }

  return {
    queryClient: client,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}

export { createTestQueryClient };
