"use client";

import { TextField, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/utils/toast";
import {
  ApiErrorResponse,
  useForgotPassword,
} from "@/hooks/auth/useAuthMutations";
import axios from "axios";
import Image from "next/image";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const { mutateAsync, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await mutateAsync(data);
      if (res?.data?.status_code === 200) {
        toast.success(res?.data?.message || "Mail sent successful");
        router.push("/login");
      }
    } catch (error: unknown) {
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
    <div className="h-screen bg-linear-to-br from-indigo-500 via-blue-500 to-purple-600 p-6 flex items-center">
      <div className="bg-white w-full flex rounded-3xl shadow-xl overflow-hidden max-w-6xl mx-auto">
        <div className="w-full min-[800px]:w-1/2 px-10 py-8 flex flex-col justify-center">
          <h1 className="text-lg sm:text-3xl font-semibold text-gray-900">
            Forgot your Password?
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-4">
            Enter your email so we can send you the password reset link
          </p>
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="hidden min-[800px]:flex w-1/2 p-10 items-center justify-center ">
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
