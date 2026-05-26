"use client";

import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Divider,
  Collapse,
  CircularProgress,
} from "@mui/material";
import CustomTextField from "@/components/common/CustomTextField";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Contact } from "@/types/contact-list.types";
import { z } from "zod";
interface Props {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
  lists: { id: string; name: string }[];
  onSubmit: (id: string, data: Contact) => void;
  isUpdatingContact?: boolean;
}

const schema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  contact_list_id: z.string().optional(),
  dnc: z.boolean().optional(),
  timezone: z.string().optional(),
  business_name: z.string().optional(),
  job_title: z.string().optional(),
  full_address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  customFields: z
    .object({
      custom_1: z.string().optional(),
      custom_2: z.string().optional(),
      custom_3: z.string().optional(),
      custom_4: z.string().optional(),
      custom_5: z.string().optional(),
      custom_6: z.string().optional(),
      custom_7: z.string().optional(),
      custom_8: z.string().optional(),
    })
    .optional(),
});

type FormData = z.infer<typeof schema>;

const customFieldKeys = [
  "custom_1",
  "custom_2",
  "custom_3",
  "custom_4",
  "custom_5",
  "custom_6",
  "custom_7",
  "custom_8",
] as const;

export default function EditContactDrawer({
  open,
  onClose,
  contact,
  lists,
  onSubmit,
  isUpdatingContact = false,
}: Props) {
  const { register, handleSubmit, reset, control } = useForm<FormData>({
    defaultValues: {
      contact_list_id: "",
    },
  });
  const [activeTab, setActiveTab] = useState<"info" | "conversations">("info");
  const [customFieldsOpen, setCustomFieldsOpen] = useState(false);

  useEffect(() => {
    if (contact) {
      reset({
        first_name: contact.first_name,
        last_name: contact.last_name,
        phone: contact.phone,
        contact_list_id: contact.listId ?? "",
        email: contact?.email ?? "",
        dnc: contact?.dnc ?? false,
        timezone: contact?.timezone ?? "",
        business_name: contact?.business_name ?? "",
        job_title: contact?.job_title ?? "",
        full_address: contact?.full_address ?? "",
        city: contact?.city ?? "",
        postal_code: contact?.postal_code ?? "",
        state: contact?.state ?? "",
        country: contact?.country ?? "",
      });
    } else {
      reset({
        first_name: "",
        last_name: "",
        phone: "",
        contact_list_id: "",
        email: "",
        dnc: false,
        timezone: "",
        business_name: "",
        job_title: "",
        full_address: "",
        city: "",
        postal_code: "",
        state: "",
        country: "",
      });
    }
  }, [contact, reset]);

  const submit = (data: FormData) => {
    if (!contact) return;
    const mergedContact: Contact = {
      ...contact,
      ...data,
      contact_list_id:
        data.contact_list_id === "" ? null : data.contact_list_id,
    };
    onSubmit(contact.id, mergedContact);
    // onClose();
  };

  const tabButtonStyle = (isActive: boolean) => ({
    textTransform: "none",
    borderRadius: "10px",
    borderColor: isActive ? "#2F6AFF" : "#D0D5DD",
    color: isActive ? "#2F6AFF" : "#667085",
    backgroundColor: isActive ? "#2F6AFF1A" : "transparent",
    "&:hover": {
      borderColor: isActive ? "#2F6AFF" : "#98A2B3",
      backgroundColor: isActive ? "#2F6AFF1A" : "#F9FAFB",
      color: "#2F6AFF",
    },
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 460 } },
      }}
    >
      <Box className="h-full flex flex-col">
        {/* Header */}
        <Box className="flex items-center justify-between px-4 sm:px-6 py-4 pb-3">
          <Box>
            <Typography
              sx={{ fontSize: 16, fontWeight: 500, color: "#464646" }}
            >
              {contact?.first_name} {contact?.last_name}
            </Typography>
            <Typography className="text-xs text-gray-500">
              Last updated: Dec 4th, 2025, 1:13 am
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Tabs */}
        <Box className="px-4 sm:px-6 pb-4 flex gap-2">
          <Button
            variant="outlined"
            onClick={() => setActiveTab("info")}
            sx={tabButtonStyle(activeTab === "info")}
          >
            Contact Info
          </Button>
          <Button
            variant="outlined"
            onClick={() => setActiveTab("conversations")}
            sx={tabButtonStyle(activeTab === "conversations")}
          >
            Conversations
          </Button>
        </Box>
        <Divider />

        {/* CONTACT INFO TAB */}
        {activeTab === "info" && (
          <form
            onSubmit={handleSubmit(submit)}
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5"
            id="edit-contact-form"
          >
            {/* Name */}
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomTextField
                label="First name"
                size="small"
                {...register("first_name")}
                fullWidth
              />
              <CustomTextField
                label="Last name"
                size="small"
                {...register("last_name")}
                fullWidth
              />
            </Box>

            {/* Phone + Email */}
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomTextField
                label="Phone"
                size="small"
                {...register("phone")}
                fullWidth
              />
              <CustomTextField
                label="Email"
                size="small"
                {...register("email")}
                fullWidth
              />
            </Box>

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="contact_list_id"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    label="Contact list"
                    size="small"
                    fullWidth
                  >
                    {lists.map((l) => (
                      <MenuItem key={l.id} value={l.id}>
                        {l.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />

              <CustomTextField
                label="Enable 'Do not call'"
                size="small"
                {...register("dnc")}
                fullWidth
              />
            </Box>

            <CustomTextField
              label="Contact Timezone"
              size="small"
              {...register("timezone")}
              fullWidth
            />

            {/* Additional Info */}
            <Typography className="font-semibold" sx={{ mt: 2 }}>
              Additional Info
            </Typography>

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <CustomTextField
                label="Business name"
                size="small"
                {...register("business_name")}
              />
              <CustomTextField
                label="Job title"
                size="small"
                {...register("job_title")}
              />
            </Box>

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomTextField
                label="Address"
                size="small"
                {...register("full_address")}
              />
              <CustomTextField
                label="City"
                size="small"
                {...register("city")}
              />
            </Box>

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomTextField
                label="ZIP code"
                size="small"
                {...register("postal_code")}
              />
              <CustomTextField
                label="State"
                size="small"
                {...register("state")}
              />
            </Box>

            <CustomTextField
              label="Country"
              size="small"
              {...register("country")}
              fullWidth
            />

            {/* Custom Fields */}
            <Box
              className="flex justify-between items-center p-3 mt-4 cursor-pointer"
              onClick={() => setCustomFieldsOpen((prev) => !prev)}
            >
              <Typography className="font-medium text-[#363636]">
                Custom Fields
              </Typography>
              {customFieldsOpen ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowRightIcon />
              )}
            </Box>

            <Collapse in={customFieldsOpen}>
              <Box className="space-y-3 pt-3">
                {customFieldKeys.map((key, index) => (
                  <CustomTextField
                    key={key}
                    label={`Custom Field ${index + 1}`}
                    size="small"
                    {...register(`customFields.${key}`)}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                ))}
              </Box>
            </Collapse>

            {/* Footer Buttons */}
            <Box className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outlined"
                fullWidth
                onClick={onClose}
                disabled={isUpdatingContact}
                sx={{ textTransform: "none", borderRadius: "10px" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-contact-form"
                fullWidth
                variant="contained"
                disabled={isUpdatingContact}
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  backgroundColor: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  "&:hover": { backgroundColor: "#1d4ed8" },
                  "&.Mui-disabled": {
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    opacity: 1,
                  },
                }}
              >
                {isUpdatingContact ? (
                  <>
                    <CircularProgress size={18} sx={{ color: "#fff" }} />
                    Updating...
                  </>
                ) : (
                  "Finish"
                )}
              </Button>
            </Box>
          </form>
        )}

        {/* CONVERSATIONS TAB */}
        {activeTab === "conversations" && (
          <Box className="flex-1 flex items-center justify-center text-gray-500">
            No conversations found.
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
