import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { campaignService } from "@/services/campaign.service";

export const useCampaignById = (id?: string | number) =>
  useQuery({
    queryKey: ["campaigns", id],
    queryFn: () => campaignService.getCampaignById({ campaignId: String(id) }),
    enabled: !!id,
  });

export const useCampaigns = (limit: number, skip: number) =>
  useQuery({
    queryKey: ["campaigns", limit, skip],
    queryFn: () => campaignService.getCampaigns({ limit, skip }),
    placeholderData: keepPreviousData,
    retry: 1,
    refetchOnWindowFocus: false,
  });

