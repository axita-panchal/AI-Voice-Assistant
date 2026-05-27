import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";
import { GetAnalyticsParams } from "@/types/analytics.types";

export const useGetAnalytics = (params: GetAnalyticsParams) => {
  return useQuery({
    queryKey: ["analytics", params],
    queryFn: () => analyticsService.getAnalytics(params),
    enabled: !!params.subaccount_id,
  });
};
