"use client";

import { useState } from "react";
import { Button, Avatar, Pagination } from "@mui/material";
import GenericTable, { Column } from "../common/DynamicTable";
import AddTeamMemberModal, { RoleKey } from "./AddTeamMemberModal";
import IconButton from "../common/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useDeleteUser } from "@/hooks/user/useUserMutations";
import { useTeamMemberUsers } from "@/hooks/user/useUserQueries";
import ConfirmModal from "../common/ConfirmModal";
import { toast } from "@/utils/toast";
import TableActionButton from "../common/TableActionButton";
import { API_ROLE_TO_KEY } from "@/utils/enums";

/* -------------------------------------------------------
   API TYPES
------------------------------------------------------- */

type SubAccountData = {
  id: string;
  name: string;
  description: string;
};

type ApiUser = {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  full_name: string;
  sub_account_id: string | null;
  sub_account: SubAccountData;
};

/* -------------------------------------------------------
   UI TYPES
------------------------------------------------------- */

type TeamMember = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: RoleKey;
  organization?: string;
  actions?: string;
  subaccountDetails?: SubAccountData;
};

/* -------------------------------------------------------
   ROLE MAPS
------------------------------------------------------- */

const ROLE_MAP: Record<RoleKey, { label: string; color: string }> = {
  "agency-owner": {
    label: "Agency Owner",
    color: "bg-orange-100 text-orange-600",
  },
  "agency-admin": {
    label: "Agency Admin",
    color: "bg-orange-100 text-orange-600",
  },
  "workspace-editor": {
    label: "Workspace Editor",
    color: "bg-blue-100 text-blue-600",
  },
  "workspace-viewer": {
    label: "Workspace Viewer",
    color: "bg-green-100 text-green-600",
  },
};

/* -------------------------------------------------------
   COMPONENT
------------------------------------------------------- */

export default function TeamMembers() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const skip = (page - 1) * limit;
  const { mutateAsync: deleteUser, isPending } = useDeleteUser();

  const { data: usersResponse, isLoading } = useTeamMemberUsers(limit, skip);

  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  /* ---------------------------------------------------
     MAP API USERS → TABLE DATA
  --------------------------------------------------- */

  const users = usersResponse?.data?.users ?? [];
  const meta = usersResponse?.data?.data?.meta;

  const totalCount = meta?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  const teamMembers: TeamMember[] =
    users?.map((user: ApiUser) => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: API_ROLE_TO_KEY[user.role],
      organization: user.sub_account_id ?? "",
      subaccountDetails: user?.sub_account,
    })) ?? [];

  /* ---------------------------------------------------
     HANDLERS
  --------------------------------------------------- */

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    const deletedUserRes = await deleteUser(memberToDelete.id);
    if (deletedUserRes?.data?.status_code === 200) {
      toast.success(
        deletedUserRes?.data?.message || "User deleted successfully",
      );
    }

    setDeleteOpen(false);
    setMemberToDelete(null);
  };

  /* ---------------------------------------------------
     TABLE COLUMNS
  --------------------------------------------------- */

  const columns: Column<TeamMember>[] = [
    {
      key: "first_name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar>{row.first_name.charAt(0)?.toUpperCase()}</Avatar>
          <span>
            {row.first_name} {row.last_name}
          </span>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => {
        const roleInfo = ROLE_MAP[row.role];
        return (
          <span
            className={`px-2 py-1 rounded-md font-medium ${roleInfo?.color} whitespace-nowrap overflow-hidden text-ellipsis
          inline-block max-w-full`}
          >
            {roleInfo?.label}
          </span>
        );
      },
    },
    {
      key: "organization",
      label: "Organization",
      render: (row) => row.subaccountDetails?.name || "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
          <TableActionButton
            icon="/remove.png"
            tooltip="Delete"
            size={30}
            onClick={(e) => {
              e.stopPropagation();
              setMemberToDelete(row);
              setDeleteOpen(true);
            }}
          />
        </>
      ),
    },
  ];

  /* ---------------------------------------------------
     RENDER
  --------------------------------------------------- */

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Team members</h2>

        <Button
          variant="contained"
          className="bg-[#2F6AFF]! capitalize! rounded-xl!"
          onClick={() => {
            setSelectedMember(null);
            setOpen(true);
          }}
        >
          + Add member
        </Button>
      </div>

      <>
        {isLoading ? (
          <div className="text-center py-6">Loading team members…</div>
        ) : (
          <GenericTable
            columns={columns}
            data={teamMembers}
            onRowClick={(row) => {
              setSelectedMember(row);
              setOpen(true);
            }}
          />
        )}
      </>
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination
            page={page}
            count={totalPages}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </div>
      )}

      {/* MODAL */}
      <AddTeamMemberModal
        open={open}
        member={selectedMember}
        onClose={() => {
          setOpen(false);
          setSelectedMember(null);
        }}
        onSuccess={() => {
          setOpen(false);
          setSelectedMember(null);
        }}
      />
      <ConfirmModal
        open={deleteOpen}
        title="Delete Team Member ?"
        description="Are you sure you want to remove this user? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={isPending}
        onCancel={() => {
          setDeleteOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      >
        {memberToDelete && (
          <div className="flex items-center gap-3">
            <Avatar>{memberToDelete.first_name.charAt(0)}</Avatar>
            <div>
              <p className="font-medium">
                {memberToDelete.first_name} {memberToDelete.last_name}
              </p>
              <p className="text-sm text-gray-500">{memberToDelete.email}</p>
            </div>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
