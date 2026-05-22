"use client";

import {
  Drawer,
  Box,
  Typography,
  Button,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  IconButton as MuiIconButton,
} from "@mui/material";
import CustomTextField from "@/components/common/CustomTextField";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInputField from "@/components/common/PhoneInputField";
import CloseIcon from "@mui/icons-material/Close";
import { isValidPhoneNumber } from "react-phone-number-input";
import { CreateContactPayload } from "@/types/contact-list.types";

/* ================= TYPES ================= */

type ContactList = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  lists: ContactList[];
  defaultListId?: string;
  onSubmit: (data: CreateContactPayload) => Promise<void> | void;
  isCreatingContact?: boolean;
};

/* ================= VALIDATION ================= */

const schema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z
    .string()
    .optional()
    .refine((val) => !!val, { message: "Phone number is required" })
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Enter valid phone number",
    }),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  // contact_list_id: z.string().min(1, "Contact list is required"),
  contact_list_id: z.string(),
});

type FormData = z.infer<typeof schema>;

/* ================= COMPONENT ================= */

export default function AddContactDrawer({
  open,
  onClose,
  lists,
  defaultListId,
  onSubmit,
  isCreatingContact,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      phone: data.phone!,
    });
    reset();
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
        },
      }}
    >
      <Box className="h-full flex flex-col">
        {/* ================= Header ================= */}
        <Box className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Box className="flex items-center gap-2">
            <div className="p-1 bg-gray-200 border border-gray-300 rounded">
              <Image
                src="/assets/svgs/plus.svg"
                alt="Add"
                width={16}
                height={16}
              />
            </div>
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
              Add Contact
            </Typography>
          </Box>

          <MuiIconButton
            onClick={() => {
              reset();
              onClose();
            }}
          >
            <CloseIcon />
          </MuiIconButton>
        </Box>

        {/* ================= Form (Scrollable) ================= */}
        <Box className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <form
            id="add-contact-form"
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                First Name
              </label>
              <CustomTextField
                fullWidth
                size="small"
                {...register("first_name")}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Last Name
              </label>
              <CustomTextField
                fullWidth
                size="small"
                {...register("last_name")}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </div>

            {/* Phone */}
            <PhoneInputField
              name="phone"
              control={control}
              error={errors.phone?.message}
            />

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <CustomTextField
                fullWidth
                size="small"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </div>

            {/* Contact List */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Contact List
              </label>
              <FormControl fullWidth size="small">
                <Select
                  defaultValue=""
                  {...register("contact_list_id")}
                  // error={!!errors.contact_list_id}
                >
                  <MenuItem value="" disabled>
                    Choose contact list
                  </MenuItem>
                  {lists
                    .filter((l) => l.id !== "all")
                    .map((l) => (
                      <MenuItem key={l.id} value={l.id}>
                        {l.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </form>
        </Box>

        {/* ================= Footer (Sticky) ================= */}
        <Box className="px-4 sm:px-6 py-4 bg-white  flex flex-col sm:flex-row gap-2">
          <Button
            type="submit"
            form="add-contact-form"
            fullWidth
            variant="contained"
            disabled={isCreatingContact}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
              "&.Mui-disabled": {
                backgroundColor: "#2563eb",
                color: "#fff",
                opacity: 1,
              },
            }}
          >
            Finish
            {isCreatingContact && (
              <CircularProgress size={18} sx={{ color: "#fff", ml: 1 }} />
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              onClose();
              reset();
            }}
            sx={{ textTransform: "none", borderRadius: "10px" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
