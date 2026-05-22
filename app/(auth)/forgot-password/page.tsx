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
import AuthLayout from "@/components/common/AuthLayout";

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
    <AuthLayout
      title="Forgot your Password?"
      subtitle="Enter your email so we can send you the password reset link"
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
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Send Email"
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
      </form>
    </AuthLayout>
  );
}
