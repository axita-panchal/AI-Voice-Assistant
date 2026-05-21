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
import { AxiosError } from "axios";
import PhoneInputField from "@/components/common/PhoneInputField";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useRegister } from "@/hooks/auth/useAuthMutations";
import Image from "next/image";

/* ================= VALIDATION ================= */
const schema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),

  last_name: z.string().min(2, "Last name must be at least 2 characters"),

  account_name: z.string().min(3, "Account name must be at least 3 characters"),

  phone: z
    .string()
    .optional()
    .refine((val) => !!val, {
      message: "Phone number is required",
    })
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Enter a valid phone number",
    }),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});
type FormData = {
  first_name: string;
  last_name: string;
  account_name: string;
  email: string;
  password: string;
  phone?: string;
};
type RegisterPayload = {
  first_name: string;
  last_name: string;
  account_name: string;
  email: string;
  password: string;
  phone: string;
};

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string>;
  detail?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const payload: RegisterPayload = {
      ...data,
      phone: data.phone!,
    };
    try {
      const res = await mutateAsync(payload);

      toast.success(res?.data?.message || "Signup successful");
      router.push("/login");
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;

      const apiMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Signup failed";

      toast.error(apiMessage);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-blue-500 to-purple-600 px-4 py-6 sm:p-6 flex sm:items-center">
      <div className="bg-white w-full flex flex-col min-[1000px]:flex-row rounded-3xl shadow-xl overflow-hidden max-w-6xl mx-auto">
        {/* ================= LEFT FORM ================= */}
        <div className="w-full min-[1000px]:w-1/2 px-4 sm:px-8 lg:px-10 py-6 sm:py-8 flex flex-col justify-center">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Get Started with Your Account
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-4">
            Create your account to securely access all tools and services.
          </p>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* First + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  First Name
                </label>
                <TextField
                  placeholder="First name"
                  fullWidth
                  size="small"
                  sx={{ backgroundColor: "#F7F9FF" }}
                  {...register("first_name")}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Last Name
                </label>
                <TextField
                  placeholder="Last name"
                  fullWidth
                  size="small"
                  sx={{ backgroundColor: "#F7F9FF" }}
                  {...register("last_name")}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              </div>
            </div>

            {/* Account Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Account Name
              </label>
              <TextField
                placeholder="Account name"
                fullWidth
                size="small"
                sx={{ backgroundColor: "#F7F9FF" }}
                {...register("account_name")}
                error={!!errors.account_name}
                helperText={errors.account_name?.message}
              />
            </div>

            {/* Phone */}
            <div>
              <PhoneInputField
                name="phone"
                control={control}
                error={errors.phone?.message}
              />
            </div>

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
                placeholder="********"
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
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
                py: { xs: 1.4, sm: 1.2 },
                mt: 1,
                backgroundColor: "#2563eb",
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              {isPending ? <CircularProgress size={20} /> : "Continue"}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>

        {/* ================= RIGHT IMAGE ================= */}
        <div className="hidden min-[1000px]:flex w-1/2 p-10 items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="/assets/svgs/logo.png"
              alt="Top Logo"
              width={120}
              height={120}
              className="absolute top-12 left-12 z-10"
            />
            <Image
              src="/assets/svgs/login_logo.png"
              alt="Signup"
              className="object-contain"
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
