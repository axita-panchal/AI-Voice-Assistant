"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Column } from "@/components/common/DynamicTable";
import GenericTable from "@/components/common/DynamicTable";
import IconButton from "@/components/common/IconButton";
import AddNewAgentModal from "@/components/add-agent/AddAgentModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useDeleteAgent } from "@/hooks/agent/useAgentMutations";
import { useAgents } from "@/hooks/agent/useAgentQueries";
import { toast } from "@/utils/toast";
import axios from "axios";
import { ApiErrorResponse } from "@/hooks/auth/useAuthMutations";
import Image from "next/image";
import TableActionButton from "@/components/common/TableActionButton";

type Agent = {
  id: number;
  name: string;
  description: string;
  phone_number_option: string;
};

const AgentList = () => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state?.auth?.user);
  const subaccountId = useSelector(
    (state: RootState) => state?.workspace?.activeWorkspace?.id,
  );

  const [page] = useState(1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const { data: agentsResponse, isLoading } = useAgents(
    limit,
    skip,
    subaccountId,
  );
  const agents = agentsResponse?.data?.agents || [];

  const { mutateAsync: deleteAgent, isPending } = useDeleteAgent();

  const [openModal, setOpenModal] = useState(false);
  const [openAddWorkSpaceFisrtModal, setOpenAddWorkSpaceFisrtModal] =
    useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  const handleRowClick = (row: Agent) => {
    router.push(`/agents?selected=${row.id}&setting=agent-prompt`);
  };

  const handleConfirmDelete = async () => {
    if (!agentToDelete) return;

    try {
      const res = await deleteAgent(agentToDelete.id.toString());

      if (res?.data?.status_code === 200) {
        toast.success(res?.data?.message || "Agent deleted successfully");
        setDeleteOpen(false);
        setAgentToDelete(null);
      }
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

  const columns: Column<Agent>[] = [
    {
      key: "name",
      label: "Agent",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "phone_number_option",
      label: "Phone number",
    },
    {
      key: "id",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {/* <TableActionButton
            icon="/copy.png"
            tooltip="Copy"
            onClick={(e) => {
              e.stopPropagation();
            }}
          /> */}
          <TableActionButton
            icon="/remove.png"
            tooltip="Delete"
            onClick={(e) => {
              e.stopPropagation();
              setAgentToDelete(row);
              setDeleteOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  const isEmpty = !isLoading && agents.length === 0;

  const handleCreateAgent = () => {
    if (!subaccountId) {
      setOpenAddWorkSpaceFisrtModal(true);
      return;
    }

    setOpenModal(true);
  };

  return (
    <div className="py-6 px-15 bg-[#F6F8FB] h-full">
      {!subaccountId || isLoading || !isEmpty ? (
        <Box className="p-6 h-full rounded-[20px] bg-white border border-[#DDDDDD]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Image
                src="/assets/svgs/agent.svg"
                alt="Agent Icon"
                width={24}
                height={24}
              />
              List of agents
            </h2>

            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 bg-[#2F6AFF] text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              <AddIcon sx={{ fontSize: 16 }} />
              New Agent
            </button>
          </div>

          {/* Table */}
          <div className="mt-6">
            <GenericTable
              columns={columns}
              data={agents}
              onRowClick={handleRowClick}
              isLoading={!subaccountId || (isLoading && agents.length === 0)}
            />
          </div>
        </Box>
      ) : (
        // ✅ Empty State
        <Box className="flex items-center justify-center min-h-[70vh] bg-gray-100 rounded-xl">
          <Box className="text-center max-w-2xl px-6">
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Welcome {user?.first_name || "User"}!
            </Typography>

            <Typography sx={{ fontSize: 14, mb: 4, lineHeight: 1.6 }}>
              To get started, create your first AI agent by clicking the button
              below.
            </Typography>

            <Button
              variant="contained"
              onClick={() => handleCreateAgent()}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                px: 4,
                py: 1.2,
              }}
            >
              New agent
            </Button>
          </Box>
        </Box>
      )}

      {/* Add Modal */}
      <AddNewAgentModal open={openModal} onClose={() => setOpenModal(false)} />

      {/* Delete Modal */}
      <ConfirmModal
        open={deleteOpen}
        title="Delete Agent ?"
        description="Are you sure you want to remove this agent? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={isPending}
        onCancel={() => {
          setDeleteOpen(false);
          setAgentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      >
        {agentToDelete && (
          <div>
            <p className="font-medium">{agentToDelete.name}</p>
            <p className="text-sm text-gray-500">{agentToDelete.description}</p>
          </div>
        )}
      </ConfirmModal>
      {/* Add Workspace First Modal */}
      <Dialog
        open={openAddWorkSpaceFisrtModal}
        onClose={() => setOpenAddWorkSpaceFisrtModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Create Workspace First
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            You need to create a workspace before creating an agent. Agents are
            always created inside a workspace.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenAddWorkSpaceFisrtModal(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setOpenAddWorkSpaceFisrtModal(false);
              router.push("settings/workspaces");
            }}
            sx={{ textTransform: "none" }}
          >
            Create Workspace
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AgentList;
