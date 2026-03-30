import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { authService } from "@/services/auth.service";

/* ---------- Types ---------- */

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  account_name: string;
  phone: string;
  email: string;
  password: string;
};

export type ForgotPasswordPayload = { email: string };

export type ResetPasswordPayload = {
  password: string;
  confirm_password: string;
  token: string;
};

export type User = {
  id: string;
  account_id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_admin: boolean;
  is_agency_owner: boolean;
};

export type LoginResponse = {
  status_code: number;
  message: string;
  // data: {
  token_type: string;
  access_token: string;
  refresh_token: string;
  user: User;
  // };
};

export type RegisterResponse = {
  status_code: number;
  message: string;
  data: {
    user: User;
  };
};

export type ApiErrorResponse = {
  message?: string;
  detail?: string;
  errors?: Record<string, string>;
};

export type ForgotPasswordResponse = {
  status_code: number;
  message: string;
};

/* ---------- Mutations ---------- */

export const useLogin = () =>
  useMutation<
    AxiosResponse<LoginResponse>,
    AxiosError<ApiErrorResponse>,
    FormData
  >({
    mutationFn: authService.login,
    onSuccess: (res) => {
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    },
  });

export const useRegister = () =>
  useMutation<
    AxiosResponse<RegisterResponse>,
    AxiosError<ApiErrorResponse>,
    RegisterPayload
  >({
    mutationFn: authService.register,
  });

export const useForgotPassword = () =>
  useMutation<
    AxiosResponse<ForgotPasswordResponse>,
    AxiosError<ApiErrorResponse>,
    ForgotPasswordPayload
  >({
    mutationFn: authService.forgotPassword,
  });

export const useResetPassword = () =>
  useMutation<
    AxiosResponse<ForgotPasswordResponse>,
    AxiosError<ApiErrorResponse>,
    ResetPasswordPayload
  >({
    mutationFn: authService.resetPassword,
  });

export const useLogout = () =>
  useMutation({
    mutationFn: authService.logout,
  });
