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
            user: res?.data?.data?.user,
            access_token: res?.data?.data?.access_token,
            refresh_token: res?.data?.data?.refresh_token,
          }),
        );
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: res?.data?.data?.user,
            accessToken: res?.data?.data?.access_token,
            refreshToken: res?.data?.data?.refresh_token,
            isAuthenticated: true,
          }),
        );
        toast.success(res?.data?.message || "Login successful");
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      let message = "Invalid credentials";

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
    <div className="h-screen bg-linear-to-br from-indigo-500 via-blue-500 to-purple-600 p-6 flex items-center">
      <div className="bg-white w-full flex rounded-3xl shadow-xl overflow-hidden max-w-6xl mx-auto">
        {/* LEFT FORM */}
        <div className="w-full min-[800px]:w-1/2 px-10 py-8 flex flex-col justify-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Log in to your account
          </h1>

          <p className="text-sm text-gray-500 mt-1 mb-4">
            Welcome back! Enter your credentials to access your account
          </p>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <TextField
                placeholder="Enter your email"
                fullWidth
                size="small"
                sx={{ backgroundColor: "#F7F9FF" }}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>
              <TextField
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                fullWidth
                size="small"
                sx={{ backgroundColor: "#F7F9FF" }}
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline cursor-pointer"
                onClick={() => router.push("forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isPending}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                py: 1.2,
                mt: 1,
                backgroundColor: "#2563eb",
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              {isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Continue"
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-2">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden min-[800px]:flex w-1/2 p-10 items-center justify-center ">
          {/* <img
            src="/assets/svgs/login_logo.png"
            alt="Login"
            className="w-full h-full object-contain"
          /> */}
          <Image
            src="/assets/svgs/login_logo.png"
            alt="Login"
            width={600}
            height={600}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
