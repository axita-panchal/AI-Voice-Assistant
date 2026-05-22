"use client";

import { useEffect } from "react";
import {
  Drawer,
  IconButton as MuiIconButton,
  CircularProgress,
} from "@mui/material";
import CustomTextField from "@/components/common/CustomTextField";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CallIcon from "@mui/icons-material/Call";
import { useForm, useFieldArray, type Path } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { isAxiosError } from "axios";
import { toast } from "@/utils/toast";
import PhoneInputField from "@/components/common/PhoneInputField";
import { useOutboundCall } from "@/hooks/calls/useOutboundCallMutation";
import type { ApiErrorResponse } from "@/hooks/auth/useAuthMutations";

const personSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone_number: z
    .string()
    .optional()
    .refine((val) => !!val, {
      message: "Phone number is required",
    })
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Enter a valid phone number",
    }),
});

const schema = z.object({
  persons: z
    .array(personSchema)
    .min(1, "Add at least one people before placing a call"),
});

type FormValues = z.infer<typeof schema>;

const emptyPerson = () => ({ name: "", phone_number: "" });

const defaultValues: FormValues = {
  persons: [emptyPerson()],
};

interface MakeCallDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MakeCallDrawer({ open, onClose }: MakeCallDrawerProps) {
  const { mutateAsync, isPending } = useOutboundCall();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, remove } = useFieldArray({
    control,
    name: "persons",
  });

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const onSubmit = async (data: FormValues) => {
    const payload = data.persons[0];

    try {
      const res = await mutateAsync(payload);
      toast.success(
        res.data?.message ??
          `Call request sent for ${1} contact(s).`,
      );
      onClose();
    } catch (error: unknown) {
      let message = "Could not start calls. Try again.";

      if (isAxiosError<ApiErrorResponse>(error)) {
        const data = error.response?.data;
        message =
          (typeof data?.detail === "string" ? data.detail : undefined) ||
          data?.message ||
          message;
      }

      toast.error(message);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "w-full sm:w-[420px] max-w-full",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-col p-4 sm:p-6"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-[#2563eb]">
              <CallIcon sx={{ fontSize: 18 }} />
            </div>
            <span className="text-base text-[#464646]">Make a call</span>
          </div>
          <MuiIconButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </MuiIconButton>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto pr-1 sm:pr-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-4"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Full Name
                </span>
                {fields.length > 2 && (
                  <MuiIconButton
                    size="small"
                    aria-label={`Remove person ${index + 1}`}
                    onClick={() => remove(index)}
                    className="text-gray-500"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </MuiIconButton>
                )}
              </div>
              <div className="space-y-3 flex flex-col gap-[20px]">
                <CustomTextField
                  placeholder="Full name"
                  fullWidth
                  size="small"
                  {...register(`persons.${index}.name`)}
                  error={!!errors.persons?.[index]?.name}
                  helperText={errors.persons?.[index]?.name?.message}
                />
                <PhoneInputField<FormValues>
                  name={`persons.${index}.phone_number` as Path<FormValues>}
                  control={control}
                  error={errors.persons?.[index]?.phone_number?.message}
                />
              </div>
            </div>
          ))}

          {/* <Button
            type="button"
            variant="outlined"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => append(emptyPerson())}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              borderColor: "#2563eb",
              color: "#2563eb",
            }}
          >
            Add more
          </Button> */}
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
          >
            {isPending && (
              <CircularProgress size={18} color="inherit" aria-hidden />
            )}
            {isPending ? "Calling.." : "Start call"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer rounded-lg bg-gray-100 py-2 text-sm sm:flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </Drawer>
  );
}
