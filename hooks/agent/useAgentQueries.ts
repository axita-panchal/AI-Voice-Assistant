import { useQuery } from "@tanstack/react-query";
import { agentService } from "@/services/agent.service";
import { keepPreviousData } from "@tanstack/react-query";

export const useAgents = (
  limit: number,
  skip: number,
  subaccountId?: string,
) => {
  return useQuery({
    queryKey: ["agents", subaccountId, limit, skip],
    queryFn: () =>
      agentService.getAgents({
        limit,
        skip,
        subaccountId: subaccountId as string,
      }),
    enabled: !!subaccountId,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

export const useAgentById = (agentId?: string) => {
  return useQuery({
    queryKey: ["agent", agentId],
    queryFn: () =>
      agentService.getAgentById({
        agentId: agentId!,
      }),
    enabled: !!agentId,
    // staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
