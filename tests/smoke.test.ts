import { describe, expect, it } from "vitest";

describe("test infrastructure", () => {
  it("runs vitest with jsdom", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });

  it("resolves path aliases", async () => {
    const { formatTime } = await import("@/utils/helper");
    expect(formatTime(13)).toBe("1 PM");
  });
});
