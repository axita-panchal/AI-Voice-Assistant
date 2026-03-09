"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Drawer } from "@mui/material";
import { useUpdateCampaign } from "@/hooks/campaign/useCampaignMutations";
import { toast } from "@/utils/toast";

type Campaign = {
  id: number;
  name: string;
  agent_id: string;
  daily_usage_cap?: number;
  min_calls_per_hour?: number;
  max_calls_per_hour?: number;
  max_dials_per_contact?: number;
  calling_days?: string[];
};

interface Props {
  open: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

interface FormValues {
  name: string;
  agentId: string;
  dailyCap: string;
  maxFollowUps: string;
  hours: number[];
  selectedDays: string[];
}

const defaultValues: FormValues = {
  name: "",
  agentId: "",
  dailyCap: "",
  maxFollowUps: "",
  hours: [9, 18],
  selectedDays: [],
};

const hourToTimeString = (hour: number) =>
  `${String(hour).padStart(2, "0")}:00:00`;

export default function EditCampaignDrawer({ open, onClose, campaign }: Props) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues,
  });

  const { mutateAsync: updateCampaign, isPending } = useUpdateCampaign();

  // ✅ Prefill form when campaign changes
  useEffect(() => {
    if (campaign) {
      reset({
        name: campaign.name,
        agentId: campaign.agent_id,
        dailyCap: String(campaign.daily_usage_cap || ""),
        maxFollowUps: String(campaign.max_dials_per_contact || ""),
        hours: [
          campaign.min_calls_per_hour || 9,
          campaign.max_calls_per_hour || 18,
        ],
        selectedDays: campaign.calling_days || [],
      });
    }
  }, [campaign, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!campaign) return;

    const payload = {
      name: data.name,
      agent_id: data.agentId,
      daily_usage_cap: Number(data.dailyCap),
      max_dials_per_contact: Number(data.maxFollowUps),
      min_calls_per_hour: data.hours[0],
      max_calls_per_hour: data.hours[1],
      start_time: hourToTimeString(data.hours[0]),
      end_time: hourToTimeString(data.hours[1]),
      calling_days: data.selectedDays,
    };

    try {
      console.log("payload for update: ", payload);
      //   await updateCampaign({
      //     campaignId: campaign.id,
      //     payload,
      //   });

      toast.success("Campaign updated successfully");
      reset(defaultValues);
      onClose();
    } catch (error) {
      toast.error("Failed to update campaign");
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="w-[420px] p-6">
        <h2 className="text-lg font-semibold mb-6">Edit Campaign</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Campaign Name</label>
            <input
              {...register("name")}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Agent ID</label>
            <input
              {...register("agentId")}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Daily Cap</label>
            <input
              type="number"
              {...register("dailyCap")}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Max Dials Per Contact
            </label>
            <input
              type="number"
              {...register("maxFollowUps")}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update Campaign"}
          </button>
        </form>
      </div>
    </Drawer>
  );
}
