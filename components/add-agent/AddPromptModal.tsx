"use client";

import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useEffect, useState } from "react";
import CustomTextField from "@/components/common/CustomTextField";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (promptText: string) => Promise<void> | void;
  initialPrompt?: string;
  isSubmitting?: boolean;
};

export default function AddPromptModal({
  open,
  onClose,
  onSave,
  initialPrompt = "",
  isSubmitting = false,
}: Props) {
  const [promptText, setPromptText] = useState(initialPrompt);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!initialPrompt?.trim();

  useEffect(() => {
    if (open) {
      setPromptText(initialPrompt || "");
      setError(null);
    }
  }, [open, initialPrompt]);

  const handleClear = () => {
    setPromptText("");
    setError(null);
  };

  const handleSubmit = async () => {
    const trimmed = promptText.trim();
    if (!trimmed) {
      setError("Prompt cannot be empty");
      return;
    }
    setError(null);
    await onSave(trimmed);
  };

  const characterCount = promptText.length;
  const wordCount = promptText.trim()
    ? promptText.trim().split(/\s+/).length
    : 0;

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="md"
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
              sm: "640px",
              md: "720px",
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
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9450FF1A] to-[#435CFE1A] flex items-center justify-center text-lg text-[#9450FF]">
              ✨
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#333]">
                {isEditMode ? "Edit Agent Prompt" : "Add Agent Prompt"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Define how your AI agent behaves, speaks, and responds to
                customers.
              </p>
            </div>
          </div>
          <IconButton
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>

        {/* PROMPT EDIT AREA */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="agent-prompt-input"
              className="text-sm font-medium text-gray-700 block"
            >
              System Prompt <span className="text-red-500">*</span>
            </label>

            {promptText && (
              <Tooltip title="Clear prompt text">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition cursor-pointer disabled:opacity-50"
                >
                  <RestartAltIcon sx={{ fontSize: 14 }} />
                  <span>Clear</span>
                </button>
              </Tooltip>
            )}
          </div>

          <CustomTextField
            id="agent-prompt-input"
            fullWidth
            multiline
            minRows={10}
            maxRows={16}
            placeholder="Enter instructions, identity, tone, objectives, and response guidelines for your agent..."
            value={promptText}
            onChange={(e) => {
              setPromptText(e.target.value);
              if (error && e.target.value.trim()) {
                setError(null);
              }
            }}
            error={!!error}
            helperText={error}
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                fontSize: "14px",
                lineHeight: "1.6",
                fontFamily: "inherit",
                backgroundColor: "#FAFBFD",
                "&:hover": {
                  backgroundColor: "#fff",
                },
                "&.Mui-focused": {
                  backgroundColor: "#fff",
                },
              },
            }}
          />

          <div className="flex items-center justify-between text-xs text-gray-400 pt-1 px-1">
            <span>Supports markdown headers (# Section Name) for structured sections</span>
            <span>
              {wordCount} {wordCount === 1 ? "word" : "words"} &middot; {characterCount} characters
            </span>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{
              fontSize: "14px",
              borderRadius: "10px",
              textTransform: "none",
              borderColor: "#D1D5DB",
              color: "#4B5563",
              px: 3,
              "&:hover": {
                borderColor: "#9CA3AF",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              fontSize: "14px",
              borderRadius: "10px",
              textTransform: "none",
              backgroundColor: "#2563eb",
              px: 3,
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
              "&.Mui-disabled": {
                backgroundColor: "#2563eb",
                color: "#fff",
                opacity: 0.7,
              },
            }}
            endIcon={
              isSubmitting ? (
                <CircularProgress size={18} sx={{ color: "#fff" }} />
              ) : null
            }
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Prompt"
                : "Save Prompt"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
