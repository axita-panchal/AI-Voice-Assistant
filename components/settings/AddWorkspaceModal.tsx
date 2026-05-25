"use client";

import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import CustomTextField from "@/components/common/CustomTextField";
import { z } from "zod";

import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: WorkspaceFormData) => void;
  initialData?: WorkspaceFormData;
  updatePending?: boolean;
  createPending?: boolean;
};

const workspaceSchema = z.object({
  name: z
    .string()
    .nonempty("Workspace name is required")
    .min(3, "Minimum 3 characters required"),
  description: z.string().max(200, "Max 200 characters").optional(),
});

type WorkspaceFormData = z.infer<typeof workspaceSchema>;

export default function AddWorkspaceModal({
  open,
  onClose,
  onSubmit,
  initialData,
  updatePending = false,
  createPending = false,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const nameValue = watch("name");

  /** Reset form on open / edit */
  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || "",
        description: initialData?.description || "",
      });
    }
  }, [open, initialData, reset]);

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
        {/* HEADER */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-lg font-medium text-[#464646]">
              {initialData ? "Edit Workspace" : "New Workspace"}
            </h2>
            <p className="text-base text-gray-500 mt-1">
              A workspace can be a different client, team, or group within your
              company. Each workspace has its own agents, contact lists, and
              campaigns.
            </p>
          </div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* ICON & NAME */}
        <div className="mt-6">
          <label className="text-base text-gray-600 mb-1 block">
            Icon & Name
          </label>

          <div className="flex items-start gap-3">
            <Avatar className="bg-gray-200 text-gray-600 mt-1">
              {nameValue ? nameValue.charAt(0).toUpperCase() : "N"}
            </Avatar>

            <CustomTextField
              fullWidth
              size="small"
              placeholder="Name of the workspace"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-4">
          <label className="text-base text-gray-600 mb-1 block">
            Description{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <CustomTextField
            fullWidth
            size="small"
            multiline
            rows={3}
            placeholder="type here..."
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6 justify-end">
          <Button
            variant="outlined"
            className="capitalize!"
            sx={{ fontSize: "14px", borderRadius: "10px" }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="capitalize!"
            sx={{
              fontSize: "14px",
              borderRadius: "10px",
              backgroundColor: "#2563eb", // blue-600
              "&:hover": {
                backgroundColor: "#2563eb",
              },
              "&.Mui-disabled": {
                backgroundColor: "#2563eb",
                color: "#fff",
                opacity: 1, // prevent faded look
              },
            }}
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || updatePending || createPending}
            endIcon={
              isSubmitting || updatePending || createPending ? (
                <CircularProgress
                  size={20}
                  sx={{ color: "#fff" }} // force white loader
                />
              ) : null
            }
          >
            {initialData ? "Save Changes" : "Add Workspace"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
