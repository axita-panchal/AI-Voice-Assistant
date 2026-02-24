"use client";

import { Button, Avatar, Switch } from "@mui/material";
import GenericTable, { Column } from "../common/DynamicTable";
import { useState, useMemo, useEffect } from "react";
import IconButton from "../common/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
import ConfirmModal from "../common/ConfirmModal";
import NoTableData from "../common/NoTableData";
import { useDispatch } from "react-redux";
import { clearWorkspace } from "@/store/slices/workspaceSlice";

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
  const dispatch = useDispatch();
  /** ---------------- Pagination ---------------- */
  const [page, setPage] = useState(0);
  const limit = 20;
  const skip = page * limit;

  /** ---------------- Modals & Selection ---------------- */
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<WorkspaceProps | null>(
    null,
  );
  const [workspaceToDelete, setWorkspaceToDelete] =
    useState<WorkspaceProps | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  /** ---------------- API ---------------- */
  const {
    data: allWorkspaces,
    isLoading,
    isError,
  } = useAllWorkspaces(skip, limit);

  const { mutateAsync: deleteWorkspace, isPending: deletePending } =
    useDeleteWorkspace();
  const { mutateAsync: createWorkspace, isPending: createPending } =
    useCreateWorkspace();
  const { mutateAsync: updateWorkspace, isPending: updatePending } =
    useUpdateWorkspace();

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
        const updatedWorkspaceRes = await updateWorkspace({
          id: selectedMember.id,
          ...data,
        });
        if (updatedWorkspaceRes?.data?.status_code === 200) {
          toast.success(
            updatedWorkspaceRes?.data?.message ||
              "Subaccount Updated Successfully",
          );
        }
      } else {
        const createdWorkspaceRes = await createWorkspace(data);
        if (createdWorkspaceRes?.data?.status_code === 201) {
          toast.success(
            createdWorkspaceRes?.data?.message ||
              "Subaccount Created Successfully",
          );
        }
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

  const handleConfirmDelete = async () => {
    if (!workspaceToDelete) return;
    try {
      const deletedWorkspaceRes = await deleteWorkspace(workspaceToDelete.id);
      if (deletedWorkspaceRes?.data?.status_code === 200) {
        toast.success(
          deletedWorkspaceRes?.data?.message || "Subaccount deleted",
        );
      }
      setDeleteOpen(false);
      setWorkspaceToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["allWorkspaces"] });
    } catch (error) {
      toast.error("Failed to delete workspace");
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
      render: (row) => (
        <Switch
          size="small"
          checked={row.rebilling}
          onClick={async (e) => {
            e.stopPropagation();
            await updateWorkspace({ ...row, rebilling: !row.rebilling });
          }}
        />
      ),
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
          <IconButton
            danger
            onClick={(e) => {
              e.stopPropagation();
              setWorkspaceToDelete(row);
              setDeleteOpen(true);
            }}
            disabled={deletePending}
          >
            <DeleteOutlineIcon sx={{ fontSize: 16, cursor: "pointer" }} />
          </IconButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (tableData?.length === 0) {
      dispatch(clearWorkspace());
    }
  }, [tableData?.length]);

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

      {tableData?.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-4">
          <GenericTable
            columns={columns}
            data={tableData}
            onRowClick={(row) => handleEdit(row)}
          />
        </div>
      ) : (
        <NoTableData message="No workspaces found. Please add a workspace." />
      )}

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
        updatePending={updatePending}
        createPending={createPending}
      />
      <ConfirmModal
        open={deleteOpen}
        title="Delete Workspace ?"
        description="Are you sure you want to remove this workspace? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deletePending}
        onCancel={() => {
          setDeleteOpen(false);
          setWorkspaceToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      >
        {workspaceToDelete && (
          <>
            <div className="flex items-center gap-3">
              <Avatar>{workspaceToDelete.name.charAt(0)}</Avatar>
              <div>
                <p className="font-medium">{workspaceToDelete.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {workspaceToDelete.description}
            </p>
          </>
        )}
      </ConfirmModal>
    </div>
  );
}
