"use client";

import { Button, Avatar, Switch } from "@mui/material";
import GenericTable, { Column } from "../common/DynamicTable";
import { useState, useMemo } from "react";
import IconButton from "../common/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import {
  useCreateWorkspace,
  useDeleteWorkspace,
  useUpdateWorkspace,
} from "@/hooks/workspace/useWorkspaceMutations";
import AddWorkspaceModal from "./AddWorkspaceModal";
import { toast } from "@/utils/toast";
import axios from "axios";
import { ApiErrorResponse } from "@/hooks/auth/useAuthMutations";
import { useAllWorkspaces } from "@/hooks/workspace/useWorkspaceQueries";
import { useQueryClient } from "@tanstack/react-query";

type WorkspaceProps = {
  id: number;
  name: string;
  description?: string;
  rebilling: boolean;
  limitMinutes: boolean;
  actions?: string;
};

type WorkspaceFormData = {
  name: string;
  description?: string;
};

export default function WorkSpaceSettings() {
  const queryClient = useQueryClient();

  /** ---------------- Pagination ---------------- */
  const [page, setPage] = useState(0);
  const limit = 20;
  const skip = page * limit;

  /** ---------------- Modals & Selection ---------------- */
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<WorkspaceProps | null>(
    null,
  );

  /** ---------------- API ---------------- */
  const {
    data: allWorkspaces,
    isLoading,
    isError,
  } = useAllWorkspaces(skip, limit);
  console.log("allWorkspaces: ", allWorkspaces);

  const { mutateAsync: deleteWorkspace, isPending: deletePending } =
    useDeleteWorkspace();
  const { mutateAsync: createWorkspace } = useCreateWorkspace();
  const { mutateAsync: updateWorkspace } = useUpdateWorkspace();

  /** ---------------- Derived table data ---------------- */
  const tableData: WorkspaceProps[] = useMemo(() => {
    return (
      allWorkspaces?.data?.subaccounts?.map((w: WorkspaceProps) => ({
        id: w.id,
        name: w.name,
        description: w.description,
        rebilling: w.rebilling,
        limitMinutes: w.limitMinutes,
      })) ?? []
    );
  }, [allWorkspaces]);

  /** ---------------- Handlers ---------------- */
  const handleEdit = (member: WorkspaceProps) => {
    setSelectedMember(member);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteWorkspace(id);
      toast.success("Workspace deleted");
      queryClient.invalidateQueries({ queryKey: ["allWorkspaces"] });
    } catch {
      toast.error("Failed to delete workspace");
    }
  };

  const handleSaveWorkspace = async (data: WorkspaceFormData) => {
    try {
      if (selectedMember) {
        await updateWorkspace({ id: selectedMember.id, ...data });
        toast.success("Workspace updated");
      } else {
        await createWorkspace(data);
        toast.success("Workspace created");
      }
      queryClient.invalidateQueries({ queryKey: ["allWorkspaces"] });
      setOpen(false);
      setSelectedMember(null);
    } catch (error) {
      let message = "Something went wrong";

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          message;
      }

      toast.error(message);
    }
  };

  /** ---------------- Columns ---------------- */
  const columns: Column<WorkspaceProps>[] = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar>{row.name.charAt(0).toUpperCase()}</Avatar>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: "rebilling",
      label: "Rebilling",
      render: (row) => <Switch size="small" checked={row.rebilling} />,
    },
    {
      key: "limitMinutes",
      label: "Limit Minutes",
      render: (row) => <Switch size="small" checked={row.limitMinutes} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <IconButton onClick={() => handleEdit(row)}>
            <ModeEditOutlineOutlinedIcon
              sx={{ fontSize: 16, cursor: "pointer" }}
            />
          </IconButton>
          <IconButton
            danger
            onClick={() => handleDelete(row.id)}
            disabled={deletePending}
          >
            <DeleteOutlineIcon sx={{ fontSize: 16, cursor: "pointer" }} />
          </IconButton>
        </div>
      ),
    },
  ];

  /** ---------------- States ---------------- */
  if (isLoading) return <div>Loading workspaces...</div>;
  if (isError) return <div>Failed to load workspaces</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Workspaces</h2>
        <Button
          variant="contained"
          className="bg-blue-600! capitalize!"
          onClick={() => {
            setSelectedMember(null);
            setOpen(true);
          }}
        >
          + Add workspace
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <GenericTable columns={columns} data={tableData} />
      </div>

      <AddWorkspaceModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={
          selectedMember
            ? {
                name: selectedMember.name,
                description: selectedMember.description,
              }
            : undefined
        }
        onSubmit={handleSaveWorkspace}
      />
    </div>
  );
}
