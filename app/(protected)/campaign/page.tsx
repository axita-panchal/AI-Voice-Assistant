"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import GenericTable, { Column } from "@/components/common/DynamicTable";
import IconButton from "@/components/common/IconButton";
import CampaignDrawer from "@/components/campaign/CampaignDrawer";
import { useCampaigns } from "@/hooks/campaign/useCampaignQueries";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { Box, Button, Switch, Typography } from "@mui/material";
import {
  useDeleteCampaign,
  useUpdateCampaign,
} from "@/hooks/campaign/useCampaignMutations";
import { toast } from "@/utils/toast";
import axios from "axios";
import { ApiErrorResponse } from "@/hooks/auth/useAuthMutations";
import { Campaign } from "@/types/campaign.types";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function CampaignPage() {
  const [page] = useState(1);
  const limit = 20;
  const skip = (page - 1) * limit;
  const { data: campaignsData, isLoading } = useCampaigns(limit, skip);
  const { mutateAsync: updateCampaign, isPending: isUpdating } =
    useUpdateCampaign();
  const { mutateAsync: deleteCampaign, isPending: isDeleting } =
    useDeleteCampaign();
  const [open, setOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [deleteListId, setDeleteListId] = useState<Campaign | null>(null);

  const isEmpty = campaignsData?.data?.data?.campaigns?.length === 0;

  const columns: Column<Campaign>[] = [
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Switch
          checked={row.is_active}
          disabled={isUpdating}
          onClick={(e) => e.stopPropagation()}
          onChange={async (e) => {
            const newStatus = e.target.checked;
            try {
              await updateCampaign({
                campaignId: row.id?.toString() || "",
                payload: { ...row, is_active: newStatus },
              });
              toast.success(
                `Campaign ${newStatus ? "activated" : "deactivated"}`,
              );
            } catch (error) {
              toast.error("Failed to update status");
            }
          }}
        />
      ),
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "daily_usage_cap",
      label: "Daily Cap",
    },
    {
      key: "agent_id",
      label: "Agent",
    },
    {
      key: "dials",
      label: "Dials",
    },
    {
      key: "total_pickups",
      label: "Pickups",
    },
    {
      key: "outcome_do_not_call",
      label: "Do Not Call",
    },
    {
      key: "total_positive_outcomes",
      label: "Outcomes",
    },
    {
      key: "total_min_used",
      label: "Total Usage",
    },
    {
      key: "actions",
      label: "Action",
      className: "text-right min-w-[80px]",
      render: (row) => (
        <IconButton
          danger
          onClick={(e) => {
            e.stopPropagation();
            setDeleteListId(row);
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 16, cursor: "pointer" }} />
        </IconButton>
      ),
    },
  ];

  const handleOpenEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setOpen(true);
  };

  const handleDeleteCampaign = async (deleteCampaignData: Campaign) => {
    try {
      const deletedCampaignRes = await deleteCampaign(
        deleteCampaignData?.id?.toString() || "",
      );
      if (deletedCampaignRes?.data?.status_code === 200) {
        toast.success(
          deletedCampaignRes?.data?.message || "Campaign deleted successfully",
        );
        setDeleteListId(null);
      }
    } catch (error: unknown) {
      let message = "Invalid credentials";
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          message;
      }
      toast.error(message || "Failed to delete contact");
    }
  };

  return (
    <>
      {!isEmpty ? (
        <div className="p-6 bg-[#F6F8FB]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-medium text-gray-700">
                List of Campaigns
              </h2>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto cursor-pointer"
              >
                <AddIcon sx={{ fontSize: 16 }} />
                New Campaign
              </button>
            </div>
            <div className="mt-6">
              <GenericTable
                columns={columns}
                data={campaignsData?.data?.data?.campaigns || []}
                onRowClick={(row) => handleOpenEdit(row)}
              />
            </div>
          </div>
        </div>
      ) : (
        <Box className="flex items-center justify-center min-h-[70vh] bg-gray-100 rounded-xl">
          <Box className="text-center max-w-2xl px-6">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Create And Launch Your First Campaign
            </Typography>
            <Typography sx={{ fontSize: 18, mb: 4, lineHeight: 1.6 }}>
              Launch your AI agent and have it get on live calls by clicking the
              button below and creating your first campaign. Creating a campaign
              is easy and can be done in about 60 seconds.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                px: 4,
                py: 1.2,
              }}
            >
              New Campaign
            </Button>
          </Box>
        </Box>
      )}
      <CampaignDrawer
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedCampaign(null);
        }}
        mode={selectedCampaign ? "edit" : "create"}
        campaign={selectedCampaign}
      />

      <ConfirmModal
        open={!!deleteListId}
        title="Delete Campaign ?"
        description="Are you sure you want to remove this campaign? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={isDeleting}
        onCancel={() => {
          setDeleteListId(null);
        }}
        onConfirm={() => handleDeleteCampaign(deleteListId!)}
      >
        {deleteListId && (
          <div>
            <p className="font-medium">{deleteListId?.name}</p>
            <p className="text-sm text-gray-500">{deleteListId?.is_active}</p>
          </div>
        )}
      </ConfirmModal>
    </>
  );
}
