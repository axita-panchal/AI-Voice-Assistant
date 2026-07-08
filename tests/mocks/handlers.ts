import { http, HttpResponse } from "msw";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Default MSW handlers. Override per test with server.use(...).
 * Add domain-specific handlers here as you write service/hook tests.
 */
export const handlers = [
  http.get(`${API_URL}/auth/me`, () => {
    return HttpResponse.json({
      status_code: 200,
      message: "OK",
      data: {
        id: "user-1",
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
      },
    });
  }),
];
