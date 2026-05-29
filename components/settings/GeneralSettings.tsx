"use client";

import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";

import { RootState } from "@/store";
import { Avatar, Button, CircularProgress } from "@mui/material";
import CustomTextField, {
  CustomTextFieldProps,
} from "@/components/common/CustomTextField";
import PhoneInputField from "@/components/common/PhoneInputField";
import { useUpdateUserProfile } from "@/hooks/user/useUserMutations";
import { toast } from "@/utils/toast";
import { ApiErrorResponse } from "@/hooks/auth/useAuthMutations";

// Custom TextField with consistent styling
const SmallTextField = (props: CustomTextFieldProps) => (
  <CustomTextField size="small" fullWidth {...props} />
);

type SettingsForm = {
  phone: string;
};

export default function GeneralSettings() {
  const user = useSelector((state: RootState) => state?.auth?.user);
  const { mutateAsync: updateUserProfile, isPending } = useUpdateUserProfile();

  // react-hook-form — used for PhoneInputField (needs control)
  const { control, getValues } = useForm<SettingsForm>({
    defaultValues: { phone: "" },
  });

  // ── form state ────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [description, setDescription] = useState("");
  const [timezone, setTimezone] = useState("America/New-york");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [legalBusinessName, setLegalBusinessName] = useState("");
  const [ein, setEin] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  // ── avatar ────────────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Build the persisted avatar URL from profile_pic + env base URL
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

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user?.id) return;

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    // formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("phone_number", getValues("phone") ?? "");
    // formData.append("description", description);
    // formData.append("timezone", timezone);
    formData.append("contact_name", contactName);
    formData.append("contact_email", contactEmail);
    formData.append("contact_phone", contactPhone);
    formData.append("legal_business_name", legalBusinessName);
    formData.append("ein", ein);
    formData.append("street_address", streetAddress);
    formData.append("city", city);
    formData.append("zip", zip);
    formData.append("state", state);
    formData.append("country", country);
    if (avatarFile) {
      formData.append("profile_pic", avatarFile);
    }

    try {
      const res = await updateUserProfile({ id: user.id, formData });
      if (res?.data?.status_code === 200) {
        toast.success(res?.data?.message || "Profile updated successfully");
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
    <div className="max-w-4xl mx-auto h-full">
      <div className="rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">General Settings</h2>

        {/* Icon & Name */}
        <label className="block text-[#565656] font-medium mb-1">
          Icon & Name
        </label>
        <div className="flex items-center gap-4 mb-4">
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled
            placeholder="John Doe"
          />
        </div>

        {/* First / Last name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              First Name
            </label>
            <SmallTextField
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Last Name
            </label>
            <SmallTextField
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <SmallTextField
            value={email}
            disabled
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            type="email"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <PhoneInputField name="phone" control={control} />
        </div>

        {/* Description */}
        {/* <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Description (optional)
          </label>
          <SmallTextField
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="type here..."
          />
        </div> */}

        {/* Timezone */}
        {/* <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-1">
            Company timezone
          </label>
          <SmallTextField
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="Select timezone..."
          />
        </div> */}

        <h3 className="text-md font-semibold mb-4">Business Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Contact Name
            </label>
            <SmallTextField
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Enter contact name..."
            />
          </div>

          {(
            [
              {
                label: "Contact Email",
                value: contactEmail,
                setter: setContactEmail,
              },
              {
                label: "Contact Phone Number",
                value: contactPhone,
                setter: setContactPhone,
              },
              {
                label: "Legal Business Name",
                value: legalBusinessName,
                setter: setLegalBusinessName,
              },
              { label: "EIN", value: ein, setter: setEin },
              {
                label: "Street Address",
                value: streetAddress,
                setter: setStreetAddress,
              },
              { label: "City", value: city, setter: setCity },
              {
                label: "Zip / Postal Code",
                value: zip,
                setter: setZip,
              },
              {
                label: "State / Prov / Region",
                value: state,
                setter: setState,
              },
              { label: "Country", value: country, setter: setCountry },
            ] as {
              label: string;
              value: string;
              setter: (v: string) => void;
            }[]
          ).map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block text-gray-700 font-medium mb-1">
                {label}
              </label>
              <SmallTextField
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            variant="contained"
            onClick={handleSave}
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
      </div>
    </div>
  );
}
