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
import AuthLayout from "@/components/common/AuthLayout";

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
    <AuthLayout
      title="Get Started with Your Account"
      subtitle="Create your account to securely access all tools and services."
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

              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
            }}
          >
            {isPending ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Continue"
            )}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </>
      }
    >
      <form
        className="space-y-4 mx-auto w-full pb-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* First + Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              First Name
            </label>

            <TextField
              placeholder="First name"
              fullWidth
              size="small"
              sx={{
                backgroundColor: "#F7F9FF",

                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "48px",
                },
              }}
              {...register("first_name")}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Last Name
            </label>

            <TextField
              placeholder="Last name"
              fullWidth
              size="small"
              sx={{
                backgroundColor: "#F7F9FF",

                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "48px",
                },
              }}
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
          </div>
        </div>

        {/* Account Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Account Name
          </label>

          <TextField
            placeholder="Name"
            fullWidth
            size="small"
            sx={{
              backgroundColor: "#F7F9FF",

              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "48px",
              },
            }}
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
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Email
          </label>

          <TextField
            placeholder="Enter your email"
            fullWidth
            size="small"
            sx={{
              backgroundColor: "#F7F9FF",

              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "48px",
              },
            }}
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Password
          </label>

          <TextField
            placeholder="********"
            type={showPassword ? "text" : "password"}
            fullWidth
            size="small"
            sx={{
              backgroundColor: "#F7F9FF",

              "& .MuiOutlinedInput-root": {
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
      </form>
    </AuthLayout>
  );
}
