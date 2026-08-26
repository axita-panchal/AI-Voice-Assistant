"use client";

import { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
} from "@mui/material";
import CustomTextField from "@/components/common/CustomTextField";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAgent } from "@/hooks/agent/useAgentMutations";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "@/utils/toast";
import axios from "axios";
import { ApiErrorResponse } from "@/hooks/auth/useAuthMutations";

const PHONE_COLLECTIONS = [
  {
    value: "Shared US phone collection",
    label: "Shared US Phone Collection",
  },
  {
    value: "My own phone number",
    label: "My own phone number",
  },
];

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  phone_collection: z.string().min(1, "Phone number is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddAgentModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const subaccountId = useSelector(
    (state: RootState) => state?.workspace?.activeWorkspace?.id,
  );

  const { mutateAsync: createAgent } = useCreateAgent();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      phone_collection: PHONE_COLLECTIONS[0]?.value || "",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!subaccountId) return;

      const payload = {
        name: data.first_name,
        phone_number_option: data.phone_collection,
        description: data.description,
        subaccount_id: subaccountId,
      };

      const createAgentRes = await createAgent(payload);

      if (createAgentRes?.data?.status_code === 201) {
        toast.success(
          createAgentRes?.data?.message || "Agent created successfully",
        );
      }

      queryClient.invalidateQueries({ queryKey: ["agents"] });

      onClose();
    } catch (error: unknown) {
      console.error("Failed to create agent:", error);
      let message = "Failed to create agent";

      if (
        axios.isAxiosError<{
          detail?: string | Array<{ msg?: string; message?: string }>;
          message?: string;
        }>(error)
      ) {
        const resData = error.response?.data;
        if (typeof resData?.detail === "string") {
          message = resData.detail;
        } else if (Array.isArray(resData?.detail) && resData.detail.length > 0) {
          message =
            resData.detail[0]?.msg || resData.detail[0]?.message || message;
        } else if (typeof resData?.message === "string") {
          message = resData.message;
        }
      }

      toast.error(message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
    >
      <Box
        className="
          absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          bg-white
          w-[92%] sm:w-[540px]
          rounded-[20px]
          overflow-hidden
        "
        sx={{
          boxShadow: "0px 16px 40px rgba(0,0,0,0.10)",
        }}
      >
        {/* HEADER */}
        <Box className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#ECECEC]">
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              color: "#4A4A4A",
            }}
          >
            New agent
          </Typography>

          <button
            onClick={() => {
              onClose();
              reset();
            }}
            className="text-[#5B5B5B] hover:opacity-70 transition"
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </button>
        </Box>

        {/* BODY */}
        <Box className="px-5 pt-5 pb-6 flex flex-col gap-5">
          {/* FIRST NAME */}
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#474747",
                mb: 1,
              }}
            >
              First name
            </Typography>

            <CustomTextField
              fullWidth
              placeholder="Alexa"
              {...register("first_name")}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "46px",
                  borderRadius: "12px",
                  fontSize: "14px",
                },
              }}
            />
          </Box>

          {/* PHONE NUMBER */}
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#474747",
                mb: 1,
              }}
            >
              Phone number
            </Typography>

            <Controller
              name="phone_collection"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <Select
                    {...field}
                    displayEmpty
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      height: 46,
                      borderRadius: "12px",
                      fontSize: "14px",
                      color: "#7B7B7B",

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D9D9D9",
                      },

                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D9D9D9",
                      },

                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3366FF",
                        borderWidth: "1px",
                      },

                      "& .MuiSelect-select": {
                        padding: "12px 14px",
                      },

                      "& .MuiSvgIcon-root": {
                        color: "#A0A0A0",
                        fontSize: 24,
                        right: 10,
                      },
                    }}
                  >
                    {PHONE_COLLECTIONS.map((item) => (
                      <MenuItem
                        key={item.value}
                        value={item.value}
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          {/* DESCRIPTION */}
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#474747",
                mb: 1,
              }}
            >
              Description
            </Typography>

            <CustomTextField
              fullWidth
              multiline
              rows={4}
              placeholder="Write description..."
              {...register("description")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: "14px",
                },
              }}
            />
          </Box>

          {/* ACTION BUTTONS */}
          <Box className="flex items-center gap-3 pt-1 justify-end">
            <Button
              onClick={() => {
                onClose();
                reset();
              }}
              disableElevation
              sx={{
                width: "120px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#F3F3F3",
                color: "#6D6D6D",
                fontSize: "15px",
                fontWeight: 500,
                textTransform: "none",

                "&:hover": {
                  backgroundColor: "#F3F3F3",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              variant="contained"
              disableElevation
              sx={{
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#3366FF",
                fontSize: "15px",
                fontWeight: 500,
                textTransform: "none",

                "&:hover": {
                  backgroundColor: "#3366FF",
                },

                "&.Mui-disabled": {
                  backgroundColor: "#3366FF",
                  color: "#fff",
                  opacity: 0.7,
                },
              }}
              endIcon={
                isSubmitting ? (
                  <CircularProgress
                    size={16}
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : null
              }
            >
              Create Agent
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
