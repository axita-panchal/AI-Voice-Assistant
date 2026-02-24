import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { campaignService } from "@/services/campaign.service";
import { Campaign, UpdateCampaignVariables } from "@/types/campaign.types";

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  errors?: Record<string, string>;
};

export interface CampaignResponse {
  status_code: number;
  message: string;
  data: {
    campaign: Campaign;
  };
}

/* ---------------- CREATE ---------------- */

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: campaignService.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["campaigns"],
        exact: false,
      });
    },
  });
};

/* ---------------- UPDATE ---------------- */
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CampaignResponse>,
    AxiosError<ApiErrorResponse>,
    UpdateCampaignVariables
  >({
    mutationFn: campaignService.updateCampaign,

    onSuccess: () => {
      //  refetch ALL paginated campaign queries
      queryClient.invalidateQueries({
        queryKey: ["campaigns"],
        exact: false,
      });
    },
  });
};
/* ---------------- DELETE ---------------- */

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CampaignResponse>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: (id: string) => campaignService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
};
