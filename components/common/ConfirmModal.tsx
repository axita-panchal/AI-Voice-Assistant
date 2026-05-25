"use client";

import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
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
  primary: "!bg-[#2F6AFF] hover:!bg-blue-700",
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
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancel}
            sx={{
              textTransform: "none",
              borderColor: "grey.300",
              "&:hover": {
                borderColor: "grey.400",
                backgroundColor: "grey.100",
              },
            }}
          >
            {cancelText}
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            sx={{
              textTransform: "none",
              "&.Mui-disabled": {
                backgroundColor: "lab(48.4493% 77.4328 61.5452)",
                color: "#fff",
                opacity: 1, // prevent faded look
              },
            }}
            className={VARIANT_STYLES[variant]}
            onClick={onConfirm}
            endIcon={
              loading ? (
                <CircularProgress
                  size={20}
                  sx={{ color: "#fff" }} // force white loader
                />
              ) : null
            }
          >
            {confirmText}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
