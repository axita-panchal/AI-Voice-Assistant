"use client";

import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomTextField from "@/components/common/CustomTextField";
import { AgentCalendar } from "@/types/agent.types";

const calendarSchema = z.object({
  platform: z.literal("cal"),
  unique_id: z.string().trim().min(1, "Unique ID is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be at most 200 characters"),
});

type CalendarFormData = z.infer<typeof calendarSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AgentCalendar) => void;
  existingCalendars: AgentCalendar[];
  isSubmitting?: boolean;
  editingCalendar?: AgentCalendar | null;
};

export default function AddCalendarModal({
  open,
  onClose,
  onSubmit,
  existingCalendars,
  isSubmitting = false,
  editingCalendar = null,
}: Props) {
  const isEditMode = !!editingCalendar;
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CalendarFormData>({
    resolver: zodResolver(calendarSchema),
    defaultValues: {
      platform: "cal",
      unique_id: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && editingCalendar) {
        reset({
          platform: "cal",
          unique_id: editingCalendar.unique_id,
          description: editingCalendar.description || "",
        });
      } else {
        reset({
          platform: "cal",
          unique_id: "",
          description: "",
        });
      }
    }
  }, [open, reset, isEditMode, editingCalendar]);

  const handleFormSubmit = (data: CalendarFormData) => {
    // Check for duplicate IDs, but exclude the current calendar if in edit mode
    const isDuplicate = existingCalendars.some(
      (calendar) =>
        calendar.unique_id === data.unique_id.trim() &&
        (isEditMode ? calendar.unique_id !== editingCalendar?.unique_id : true),
    );

    if (isDuplicate) {
      setError("unique_id", {
        type: "manual",
        message: "This Unique ID is already connected",
      });
      return;
    }

    onSubmit({
      platform: data.platform,
      unique_id: data.unique_id.trim(),
      description: data.description?.trim() || undefined,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "92%",
              sm: "540px",
            },
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0px 16px 40px rgba(0,0,0,0.10)",
            margin: 0,
            backgroundColor: "#fff",
          },
        },
      }}
    >
      <DialogContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-lg font-medium text-[#464646]">
              {isEditMode ? "Edit Calendar" : "Add Calendar"}
            </h2>
            <p className="text-base text-gray-500 mt-1">
              {isEditMode
                ? "Update your calendar details."
                : "Connect a calendar so your Agent can schedule meetings."}
            </p>
          </div>
          <IconButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </div>

        <div className="mt-6">
          <label className="text-base text-gray-600 mb-1 block">Platform</label>
          <CustomTextField
            fullWidth
            size="small"
            value="cal"
            disabled
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root.Mui-disabled": {
                backgroundColor: "#F5F5F5",
              },
            }}
          />
        </div>

        <div className="mt-4">
          <label className="text-base text-gray-600 mb-1 block">
            Unique ID <span className="text-red-500">*</span>
          </label>
          <CustomTextField
            fullWidth
            size="small"
            placeholder="Enter calendar unique ID"
            {...register("unique_id")}
            error={!!errors.unique_id}
            helperText={errors.unique_id?.message}
          />
        </div>

        <div className="mt-4">
          <label className="text-base text-gray-600 mb-1 block">
            Description <span className="text-red-500">*</span>
          </label>
          <CustomTextField
            fullWidth
            size="small"
            multiline
            rows={3}
            placeholder="e.g. Use to book appointments for agent"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <Button
            variant="outlined"
            className="capitalize!"
            sx={{ fontSize: "14px", borderRadius: "10px" }}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="capitalize!"
            sx={{
              fontSize: "14px",
              borderRadius: "10px",
              backgroundColor: "#2563eb",
              "&:hover": {
                backgroundColor: "#2563eb",
              },
              "&.Mui-disabled": {
                backgroundColor: "#2563eb",
                color: "#fff",
                opacity: 0.7,
              },
            }}
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
            endIcon={
              isSubmitting ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : null
            }
          >
            {isEditMode ? "Update Calendar" : "Add Calendar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
