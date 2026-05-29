"use client";

import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input";

import { RootState } from "@/store";
import { updateUserProfile as updateUserProfileAction } from "@/store/slices/authSlice";
import { Avatar, Button, CircularProgress } from "@mui/material";
import CustomTextField, {
  CustomTextFieldProps,
} from "@/components/common/CustomTextField";
import PhoneInputField from "@/components/common/PhoneInputField";
import { useUpdateUserProfile } from "@/hooks/user/useUserMutations";
import { toast } from "@/utils/toast";
import { ApiErrorResponse } from "@/hooks/auth/useAuthMutations";

/* ─── Shared small text field ─────────────────────────────────────────────── */
const SmallTextField = (props: CustomTextFieldProps) => (
  <CustomTextField size="small" fullWidth {...props} />
);

/* ─── Validation schema ───────────────────────────────────────────────────── */
const schema = z.object({
  // Personal info — required with validation
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .optional()
    .refine((val) => !!val, { message: "Phone number is required" })
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Enter a valid phone number",
    }),

  // Timezone
  timezone: z.string().optional(),

  // Business info — all optional
  contact_name: z.string().optional(),
  contact_email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Invalid contact email",
    }),
  contact_phone: z
    .string()
    .optional()
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Enter a valid contact phone number",
    }),
  business_name: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

type SettingsForm = z.infer<typeof schema>;

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function GeneralSettings() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state?.auth?.user);
  const { mutateAsync: updateUserProfile, isPending } = useUpdateUserProfile();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
      phone: (user as any)?.phone ?? "",
      timezone: (user as any)?.business?.timezone ?? "",
      contact_name: (user as any)?.business?.contact_name ?? "",
      contact_email: (user as any)?.business?.business_email ?? "",
      contact_phone: (user as any)?.business?.business_phone ?? "",
      business_name: (user as any)?.business?.business_name ?? "",
      street_address: (user as any)?.business?.street_address ?? "",
      city: (user as any)?.business?.city ?? "",
      postal_code: (user as any)?.business?.postal_code ?? "",
      state: (user as any)?.business?.state ?? "",
      country: (user as any)?.business?.country ?? "",
    },
  });

  /* ── Avatar ─────────────────────────────────────────────────────────────── */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "";
  const persistedAvatar = user?.profile_pic
    ? `${frontendUrl}${user.profile_pic}`
    : null;
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    persistedAvatar,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  /* ── Save ───────────────────────────────────────────────────────────────── */
  const onSubmit = async (data: SettingsForm) => {
    if (!user?.id) return;

    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone ?? "");
    formData.append("timezone", data.timezone ?? "");
    formData.append("contact_name", data.contact_name ?? "");
    formData.append("contact_email", data.contact_email ?? "");
    formData.append("contact_phone", data.contact_phone ?? "");
    formData.append("business_name", data.business_name ?? "");
    formData.append("street_address", data.street_address ?? "");
    formData.append("city", data.city ?? "");
    formData.append("postal_code", data.postal_code ?? "");
    formData.append("state", data.state ?? "");
    formData.append("country", data.country ?? "");
    if (avatarFile) {
      formData.append("profile_pic", avatarFile);
    }

    try {
      const res = await updateUserProfile({ id: user.id, formData });
      if (res?.data?.status_code === 200) {
        toast.success(res?.data?.message || "Profile updated successfully");

        // Update Redux state with the new user data so Header picks it up
        const updatedUser = res?.data?.data?.user;
        if (updatedUser) {
          dispatch(updateUserProfileAction(updatedUser));
          
          // Also update localStorage so it persists across page reloads
          const auth = localStorage.getItem("auth");
          if (auth) {
            const authData = JSON.parse(auth);
            authData.user = { ...authData.user, ...updatedUser };
            localStorage.setItem("auth", JSON.stringify(authData));
          }
        }
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

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-4xl mx-auto h-full">
      <div className="rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">General Settings</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ── Avatar + display name ──────────────────────────────────────── */}
          <label className="block text-[#565656] font-medium mb-1">
            Icon & Name
          </label>
          <div className="flex items-center gap-4 mb-6">
            <Avatar
              src={avatarPreview ?? "/avatar.png"}
              sx={{ cursor: "pointer", width: 44, height: 44 }}
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <SmallTextField
              value={
                user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.full_name ?? ""
              }
              disabled
              placeholder="Full name"
            />
          </div>

          {/* ── First / Last name ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                First Name
              </label>
              <SmallTextField
                placeholder="Enter first name"
                {...register("first_name")}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Last Name
              </label>
              <SmallTextField
                placeholder="Enter last name"
                {...register("last_name")}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </div>
          </div>

          {/* ── Email ─────────────────────────────────────────────────────── */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <SmallTextField
              placeholder="Enter email"
              type="email"
              disabled
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </div>

          {/* ── Phone (PhoneInputField — same as AddContactDrawer) ─────────── */}
          <div className="mb-4">
            <PhoneInputField
              name="phone"
              control={control}
              error={errors.phone?.message}
            />
          </div>

          {/* ── Timezone ──────────────────────────────────────────────────── */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-1">
              Company Timezone
            </label>
            <SmallTextField
              placeholder="e.g. America/New_York"
              {...register("timezone")}
            />
          </div>

          {/* ── Business Information ───────────────────────────────────────── */}
          <h3 className="text-md font-semibold mb-4">Business Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Name — full width */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Contact Name
              </label>
              <SmallTextField
                placeholder="Enter contact name"
                {...register("contact_name")}
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Contact Email
              </label>
              <SmallTextField
                placeholder="Enter contact email"
                type="email"
                {...register("contact_email")}
                error={!!errors.contact_email}
                helperText={errors.contact_email?.message}
              />
            </div>

            {/* Contact Phone — PhoneInputField */}
            <div>
              <PhoneInputField
                name="contact_phone"
                control={control}
                error={errors.contact_phone?.message}
              />
            </div>

            {/* Legal Business Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Legal Business Name
              </label>
              <SmallTextField
                placeholder="Enter legal business name"
                {...register("business_name")}
              />
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Street Address
              </label>
              <SmallTextField
                placeholder="Enter street address"
                {...register("street_address")}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                City
              </label>
              <SmallTextField
                placeholder="Enter city"
                {...register("city")}
              />
            </div>

            {/* Zip / Postal Code */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Zip / Postal Code
              </label>
              <SmallTextField
                placeholder="Enter zip / postal code"
                {...register("postal_code")}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                State / Prov / Region
              </label>
              <SmallTextField
                placeholder="Enter state / prov / region"
                {...register("state")}
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Country
              </label>
              <SmallTextField
                placeholder="Enter country"
                {...register("country")}
              />
            </div>
          </div>

          {/* ── Save button ────────────────────────────────────────────────── */}
          <div className="mt-6">
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              endIcon={
                isPending ? (
                  <CircularProgress size={16} sx={{ color: "#fff" }} />
                ) : null
              }
              className="bg-[#2F6AFF]! rounded-lg! px-6! capitalize!"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
