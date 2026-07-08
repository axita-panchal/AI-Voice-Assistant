import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./mocks/server";
import "./mocks/next-navigation";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});
