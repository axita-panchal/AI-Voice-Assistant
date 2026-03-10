import { useQuery } from "@tanstack/react-query";
import { agentService } from "@/services/agent.service";

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
        subaccountId: subaccountId!,
      }),
    enabled: Boolean(subaccountId),
    staleTime: 0,
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
    staleTime: 0,
  });
};
