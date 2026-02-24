"use client";

import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Divider,
  Collapse,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Contact } from "@/types/contact-list.types";
import { z, email } from "zod";
interface Props {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
  lists: { id: string; name: string }[];
  onSubmit: (id: string, data: Contact) => void;
  isUpdatingContact?: boolean;
}

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  contact_list_id: z.string().optional(),
  dnc: z.boolean().optional(),
  timezone: z.string().optional(),
  businessName: z.string().optional(),
  jobTitle: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
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

type CustomFieldKey = (typeof customFieldKeys)[number];

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
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        contact_list_id: contact.listId ?? "",
        email: contact?.email ?? "",
        dnc: contact?.dnc ?? false,
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        phone: "",
        contact_list_id: "",
        email: "",
        dnc: false,
      });
    }
  }, [contact, reset]);

  const submit = (data: FormData) => {
    if (!contact) return;
    const mergedContact: Contact = {
      ...contact,
      ...data,
    };
    onSubmit(contact.id, mergedContact);
    onClose();
    reset();
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
        reset();
        onClose();
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
              {contact?.firstName} {contact?.lastName}
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
          >
            {/* Name */}
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="First name"
                {...register("firstName")}
                fullWidth
              />
              <TextField
                label="Last name"
                {...register("lastName")}
                fullWidth
              />
            </Box>

            {/* Phone + Email */}
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="Phone" {...register("phone")} fullWidth />
              <TextField label="Email" {...register("email")} fullWidth />
            </Box>

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="contact_list_id"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Contact list" fullWidth>
                    {lists.map((l) => (
                      <MenuItem key={l.id} value={l.id}>
                        {l.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <TextField
                label="Enable 'Do not call'"
                {...register("dnc")}
                fullWidth
              />
            </Box>

            <TextField
              label="Contact Timezone"
              {...register("timezone")}
              fullWidth
            />

            {/* Additional Info */}
            <Typography className="font-semibold" sx={{ mt: 2 }}>
              Additional Info
            </Typography>

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <TextField label="Business name" {...register("businessName")} />
              <TextField label="Job title" {...register("jobTitle")} />
            </Box>

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="Address" {...register("address")} />
              <TextField label="City" {...register("city")} />
            </Box>

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="ZIP code" {...register("zip")} />
              <TextField label="State" {...register("state")} />
            </Box>

            <TextField label="Country" {...register("country")} fullWidth />

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
                  <TextField
                    key={key}
                    label={`Custom Field ${index + 1}`}
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
                type="submit"
                variant="contained"
                fullWidth
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

              <Button
                variant="outlined"
                fullWidth
                onClick={onClose}
                sx={{ textTransform: "none", borderRadius: "10px" }}
              >
                Cancel
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
