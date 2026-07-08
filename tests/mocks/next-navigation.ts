import { vi } from "vitest";

export const mockPush = vi.fn();
export const mockReplace = vi.fn();
export const mockBack = vi.fn();
export const mockPrefetch = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    prefetch: mockPrefetch,
    refresh: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));
