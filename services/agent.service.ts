import { CreateAgentPayload, GetAgentsParams } from "@/types/agent.types";
import http from "./http";
import { UpdateAgentPayload } from "@/hooks/agent/useAgentMutations";

export const agentService = {
  createAgent: (payload: CreateAgentPayload) => {
    return http.post("/agents", payload);
  },
  getAgents: ({ limit, skip, subaccountId }: GetAgentsParams) => {
    return http.get(`/agents/?subaccount_id=${subaccountId}`, {
      params: { limit, skip },
    });
  },
  getAgentById: ({ agentId }: { agentId: string }) => {
    return http.get(`/agents/${agentId}`);
  },
  updateAgent: ({
    agentId,
    payload,
  }: {
    agentId: string;
    payload: UpdateAgentPayload;
  }) => {
    return http.patch(`/agents/${agentId}`, payload);
  },
  deleteAgent: (agentId: string) => {
    return http.delete(`/agents/${agentId}`);
  },
};
