import http from "./http";

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  account_name: string;
  phone: string;
  email: string;
  password: string;
};
type ResetPasswordPayload = {
  password: string;
  confirm_password: string;
  token: string;
};

export const authService = {
  login: (payload: FormData) => {
    return http.post("/authentication/login", payload);
  },

  register: (payload: RegisterPayload) =>
    http.post("/authentication/register", payload),

  forgotPassword: (payload: { email: string }) =>
    http.post("/authentication/forget-password", payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    http.post(
      `/authentication/reset-password?token=${payload?.token}`,
      payload,
    ),

  me: () => http.get("/auth/me"),

  logout: () => http.post("/auth/logout"),
};
