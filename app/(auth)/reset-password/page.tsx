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
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/utils/toast";
import {
  ApiErrorResponse,
  useResetPassword,
} from "@/hooks/auth/useAuthMutations";
import axios from "axios";
import Image from "next/image";

const schema = z
  .object({
    password: z
      .string()
      .min(5, "Password must be at least 5 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutateAsync, isPending } = useResetPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (!token) return;
      const payload = {
        ...data,
        token,
      };
      const res = await mutateAsync(payload);

      toast.success("Password reset successfully");
      router.push("/login");
    } catch (error: unknown) {
      let message = "Something went wrong";

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const responseData = error.response?.data;

        if (Array.isArray(responseData?.detail)) {
          message = responseData.detail
            .map((err) => {
              const field = err?.loc?.[1];
              const msg = err?.msg;

              return field ? `${field}: ${msg}` : msg;
            })
            .join(", ");
        } else if (typeof responseData?.detail === "string") {
          message = responseData.detail;
        } else if (responseData?.message) {
          message = responseData.message;
        }
      }

      toast.error(message);
    }
  };

  if (!token) {
    toast.error("Invalid or expired reset link");
    router.push("/login");
    return null;
  }

  return (
    <div className="h-screen bg-linear-to-br from-indigo-500 via-blue-500 to-purple-600 p-6 flex items-center">
      <div className="bg-white w-full flex rounded-3xl shadow-xl overflow-hidden max-w-6xl mx-auto">
        {/* LEFT FORM */}
        <div className="w-full min-[800px]:w-1/2 px-10 py-8 flex flex-col justify-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Reset your Password
          </h1>

          <p className="text-sm text-gray-500 mt-1 mb-4">
            Please kindly set your new password
          </p>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                New password
              </label>
              <TextField
                placeholder="*****************"
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

            {/* confirm Password */}
            <TextField
              placeholder="*****************"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              size="small"
              sx={{ backgroundColor: "#F7F9FF" }}
              {...register("confirm_password")}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

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
                "Send Email"
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
            className="object-contain"
            width={600}
            height={600}
          />
        </div>
      </div>
    </div>
  );
}
