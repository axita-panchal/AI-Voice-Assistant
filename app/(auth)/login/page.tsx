"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/utils/toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";
import { ApiErrorResponse, useLogin } from "@/hooks/auth/useAuthMutations";
import axios from "axios";
import Image from "next/image";
import AuthLayout from "@/components/common/AuthLayout";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { mutateAsync, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("username", data.email);
      formData.append("password", data.password);

      const res = await mutateAsync(formData);
      if (res?.status === 200) {
        dispatch(
          loginSuccess({
            user: res?.data?.user,
            access_token: res?.data?.access_token,
            refresh_token: res?.data?.refresh_token,
          }),
        );
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: res?.data?.user,
            accessToken: res?.data?.access_token,
            refreshToken: res?.data?.refresh_token,
            isAuthenticated: true,
          }),
        );
        toast.success(res?.data?.message || "Login successful");
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.log("Login error:", error);
      let message = "Something went wrong";

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          message;
      }

      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title="Log in to your account"
      subtitle="Welcome back! Enter your credentials to access your account"
      footer={
        <>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isPending}
             onClick={handleSubmit(onSubmit)}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              height: "50px",
              fontSize: "15px",
              fontWeight: 500,
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            {isPending ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Continue"
            )}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </>
      }
    >
      <form
        className="space-y-4 mx-auto w-full pb-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label className="text-sm min-[1750]:text-[18px] font-medium text-gray-700 mb-2 block">
            Email
          </label>
          <TextField
            placeholder="Enter your email"
            fullWidth
            size="small"
            autoComplete="new-password"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#F6F8FB",
                borderRadius: "10px",
                height: "48px",
              },
            }}
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </div>

        <div>
          <label className="text-sm min-[1750]:text-[18px] font-medium text-gray-700 mb-2 block">
            Password
          </label>
          <TextField
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            fullWidth
            size="small"
            autoComplete="new-password"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#F6F8FB",
                borderRadius: "10px",
                height: "48px",
              },
            }}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="text-right">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={() => router.push("forgot-password")}
          >
            Forgot password?
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
