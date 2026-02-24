import {
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from "@/types/campaign.types";
import http from "./http";

export const campaignService = {
  createCampaign: (payload: CreateCampaignPayload) => {
    return http.post("/campaign", payload);
  },
  getCampaigns: ({ limit, skip }: { limit?: number; skip?: number }) => {
    return http.get(`/campaign/`, {
      params: { limit, skip },
    });
  },
  getCampaignById: ({ campaignId }: { campaignId: string }) => {
    return http.get(`/campaign/${campaignId}`);
  },
  updateCampaign: ({
    campaignId,
    payload,
  }: {
    campaignId: string;
    payload: UpdateCampaignPayload;
  }) => {
    return http.patch(`/campaign/${campaignId}`, payload);
  },
  deleteCampaign: (campaignId: string) => {
    return http.delete(`/campaign/${campaignId}`);
  },
};
