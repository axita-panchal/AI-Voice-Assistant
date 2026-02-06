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
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCreateUser, useUpdateUser } from "@/hooks/user/useUserMutations";
import { toast } from "@/utils/toast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/hooks/auth/useAuthMutations";
import { useAllWorkspaces } from "@/hooks/workspace/useWorkspaceQueries";

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

export type RoleKey = "agency-admin" | "workspace-editor" | "workspace-viewer";

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: RoleKey;
  organization?: string;
}

interface Workspace {
  id: string;
  name: string;
}

/* ---------------------------------- */
/* Constants */
/* ---------------------------------- */

const ROLES: { value: RoleKey; label: string }[] = [
  { value: "agency-admin", label: "Agency Admin" },
  { value: "workspace-editor", label: "Workspace Editor" },
  { value: "workspace-viewer", label: "Workspace Viewer" },
];

const ROLE_NAME_MAP: Record<RoleKey, string> = {
  "agency-admin": "Agency Admin",
  "workspace-editor": "Workspace Editor",
  "workspace-viewer": "Workspace Viewer",
};

/* ---------------------------------- */
/* Schema */
/* ---------------------------------- */

const schema = z
  .object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(["agency-admin", "workspace-editor", "workspace-viewer"]),
    workspace: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.role === "workspace-editor" || data.role === "workspace-viewer") &&
      !data.workspace
    ) {
      ctx.addIssue({
        path: ["workspace"],
        message: "Workspace is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onSuccess: () => void;
};

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

export default function AddTeamMemberModal({
  open,
  onClose,
  member,
  onSuccess,
}: Props) {
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

  const user = useSelector((state: RootState) => state.auth.user);
  const { data: allWorkspaces } = useAllWorkspaces();

  const workspaceOptions: Workspace[] = allWorkspaces?.data?.subaccounts ?? [];

  const {
    handleSubmit,
    control,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (!open) return;

    if (member) {
      reset({
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        role: member.role,
        workspace: member.organization ?? "",
      });
    } else {
      reset({
        first_name: "",
        last_name: "",
        email: "",
        role: "agency-admin",
        workspace: "",
      });
    }
  }, [member, open, reset]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: ROLE_NAME_MAP[data.role],
      sub_account_id: data.workspace || null,
      full_name: `${data.first_name} ${data.last_name}`,
      is_admin: user?.is_admin ?? false,
      is_agency_owner: user?.is_agency_owner ?? false,
    };

    try {
      if (member?.id) {
        // update user
        const updatedUserRes = await updateUser({
          id: member.id,
          ...payload,
        });
        console.log("updatedUserRes: ", updatedUserRes);

        toast.success("User updated successfully");
      } else {
        // create user
        const createdUserRes = await createUser(payload);
        console.log("createdUserRes: ", createdUserRes);
        toast.success("User created successfully");
      }

      onSuccess();
      onClose();
      reset();
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      toast.error(err.response?.data?.message || "Failed to save team member");
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
        <Typography variant="h6">
          {member ? "Edit Team Member" : "New Team Member"}
        </Typography>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="First Name"
            size="small"
            {...register("first_name")}
            error={!!errors.first_name}
          />
          <TextField
            label="Last Name"
            size="small"
            {...register("last_name")}
            error={!!errors.last_name}
          />
        </div>

        <TextField
          label="Email"
          size="small"
          {...register("email")}
          error={!!errors.email}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormControl size="small" error={!!errors.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select {...field} label="Role">
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.role?.message}</FormHelperText>
            </FormControl>
          )}
        />

        {(selectedRole === "workspace-editor" ||
          selectedRole === "workspace-viewer") && (
          <Controller
            name="workspace"
            control={control}
            render={({ field }) => (
              <FormControl size="small" error={!!errors.workspace}>
                <InputLabel id="workspace-label">Workspace</InputLabel>
                <Select {...field} label="Workspace">
                  <MenuItem value="">
                    <em>Select workspace</em>
                  </MenuItem>
                  {workspaceOptions.map((ws) => (
                    <MenuItem key={ws.id} value={ws.id}>
                      {ws.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        )}

        {/* Buttons responsive */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            fullWidth
            variant="contained"
            disabled={isCreating || isUpdating}
            onClick={handleSubmit(onSubmit)}
            sx={{ textTransform: "capitalize" }}
          >
            {member ? "Save Changes" : "Add Team Member"}
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
