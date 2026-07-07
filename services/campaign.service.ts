import {
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from "@/types/campaign.types";
import http from "./http";

export const campaignService = {
  createCampaign: async (payload: CreateCampaignPayload) => {
    const res = await http.post("/campaign", payload);
    return res?.data;
  },
  getCampaigns: async ({ limit, skip }: { limit?: number; skip?: number }) => {
    const res = await http.get(`/campaign/`, {
      params: { limit, skip },
    });
    return res?.data || [];
  },
  getCampaignById: async ({ campaignId }: { campaignId: string }) => {
    const res = await http.get(`/campaign/${campaignId}`);
    return res?.data;
  },
  updateCampaign: async ({
    campaignId,
    payload,
  }: {
    campaignId: string;
    payload: UpdateCampaignPayload;
  }) => {
    const res = await http.patch(`/campaign/${campaignId}`, payload);
    return res?.data;
  },
  deleteCampaign: async (campaignId: string) => {
    const res = await http.delete(`/campaign/${campaignId}`);
    return res;
  },
};
