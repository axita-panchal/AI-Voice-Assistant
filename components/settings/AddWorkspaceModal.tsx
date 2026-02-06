"use client";

import {
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
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
      PaperProps={{ className: "rounded-2xl" }}
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

            <TextField
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
          <TextField
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
        <div className="flex gap-3 mt-6">
          <Button
            variant="contained"
            className="bg-blue-600! capitalize!"
            sx={{ fontSize: "14px" }}
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {initialData ? "Save Changes" : "Add Workspace"}
          </Button>

          <Button
            variant="outlined"
            className="capitalize!"
            sx={{ fontSize: "14px" }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
