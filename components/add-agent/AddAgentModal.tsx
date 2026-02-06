"use client";

import { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCreateAgent } from "@/hooks/agent/useAgentMutations";

/* ---------------------------------- */
/* Constants */
/* ---------------------------------- */

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

/* ---------------------------------- */
/* Schema */
/* ---------------------------------- */

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

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

export default function AddAgentModal({ open, onClose }: Props) {
  const { mutate: createAgent } = useCreateAgent();

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
      phone_collection: "", // ✅ critical fix
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
      const payload = {
        name: data.first_name,
        phone_number_option: data.phone_collection,
        description: data.description,
      };

      console.log("Final Payload:", payload);

      // 🔥 API call here
      //   const createAgentRes = await createAgent(payload);
      //   console.log("createAgentRes: ", createAgentRes);

      onClose();

      // 👉 redirect after creation
      // router.push("/add-agent");
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
          bg-white rounded-xl shadow-lg
          flex flex-col gap-4
          w-[92%] sm:w-full max-w-md
          p-4 sm:p-6
          max-h-[90vh] overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Typography variant="h6">New Agent</Typography>
          <button
            onClick={() => {
              onClose();
              reset();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* First Name */}
        <TextField
          label="First name"
          size="small"
          fullWidth
          {...register("first_name")}
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
        />

        {/* Phone Collection */}
        <Controller
          name="phone_collection"
          control={control}
          render={({ field }) => (
            <FormControl size="small" error={!!errors.phone_collection}>
              <InputLabel id="phone-label">Phone number</InputLabel>
              <Select {...field} label="Phone number">
                <MenuItem value="">
                  <em>Select phone number</em>
                </MenuItem>

                {PHONE_COLLECTIONS.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {errors.phone_collection?.message}
              </FormHelperText>
            </FormControl>
          )}
        />

        {/* Description */}
        <TextField
          label="Description"
          size="small"
          multiline
          rows={3}
          fullWidth
          {...register("description")}
        />

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            sx={{ textTransform: "capitalize" }}
          >
            Create Agent
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              onClose();
              reset();
            }}
            sx={{ textTransform: "capitalize" }}
          >
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
