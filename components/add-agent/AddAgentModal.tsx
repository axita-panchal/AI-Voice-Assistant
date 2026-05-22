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

const PHONE_COLLECTIONS = [
  {
    value: "Shared US phone collection",
    label: "Shared US Phone Collection",
  },
  {
    value: "Shared UK phone collection",
    label: "Shared UK Phone Collection",
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
    } catch (error) {
      console.error(error);
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
          w-[95%] sm:w-[680px]
          rounded-[32px]
          overflow-hidden
        "
        sx={{
          boxShadow: "0px 20px 60px rgba(0,0,0,0.12)",
        }}
      >
        {/* HEADER */}
        <Box className="flex items-center justify-between px-7 pt-7 pb-4 border-b border-[#ECECEC]">
          <Typography
            sx={{
              fontSize: "22px",
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
            <CloseIcon sx={{ fontSize: 34 }} />
          </button>
        </Box>

        {/* BODY */}
        <Box className="px-7 pt-6 pb-8 flex flex-col gap-7">
          {/* FIRST NAME */}
          <Box>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                color: "#474747",
                mb: 1.5,
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
            />
          </Box>

          {/* PHONE NUMBER */}
          <Box>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                color: "#474747",
                mb: 1.5,
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
                      height: 64,
                      borderRadius: "20px",
                      fontSize: "16px",
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
                        padding: "18px 20px",
                      },

                      "& .MuiSvgIcon-root": {
                        color: "#A0A0A0",
                        fontSize: 32,
                        right: 16,
                      },
                    }}
                  >
                    {PHONE_COLLECTIONS.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
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
                fontSize: "18px",
                fontWeight: 500,
                color: "#474747",
                mb: 1.5,
              }}
            >
              Description
            </Typography>

            <CustomTextField
              fullWidth
              multiline
              rows={5}
              {...register("description")}
            />
          </Box>

          {/* ACTION BUTTONS */}
          <Box className="flex items-center gap-4 pt-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              variant="contained"
              disableElevation
              sx={{
                width: "220px",
                height: "62px",
                borderRadius: "18px",
                backgroundColor: "#3366FF",
                fontSize: "18px",
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
                    size={18}
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : null
              }
            >
              Create Agent
            </Button>

            <Button
              onClick={() => {
                onClose();
                reset();
              }}
              disableElevation
              sx={{
                width: "165px",
                height: "62px",
                borderRadius: "18px",
                backgroundColor: "#F3F3F3",
                color: "#6D6D6D",
                fontSize: "18px",
                fontWeight: 500,
                textTransform: "none",

                "&:hover": {
                  backgroundColor: "#F3F3F3",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}