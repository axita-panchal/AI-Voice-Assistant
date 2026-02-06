"use client";

import { Modal, Box, Typography, Button } from "@mui/material";
import React from "react";

type ConfirmVariant = "danger" | "primary";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  children?: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
};

const VARIANT_STYLES: Record<ConfirmVariant, string> = {
  danger: "!bg-red-600 hover:!bg-red-700",
  primary: "!bg-blue-600 hover:!bg-blue-700",
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  loading,
  children,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal open={open} onClose={onCancel}>
      <Box className="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4">
        <Typography variant="h6" className="font-semibold">
          {title}
        </Typography>

        {description && (
          <Typography className="text-sm text-gray-600">
            {description}
          </Typography>
        )}

        {children && <div className="mt-2">{children}</div>}

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outlined" onClick={onCancel}>
            {cancelText}
          </Button>

          <Button
            variant="contained"
            disabled={loading}
            className={VARIANT_STYLES[variant]}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
