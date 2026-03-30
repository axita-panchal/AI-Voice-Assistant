import { CreateAgentPayload, GetAgentsParams } from "@/types/agent.types";
import http from "./http";
import { UpdateAgentPayload } from "@/hooks/agent/useAgentMutations";

export const agentService = {
  createAgent: (payload: CreateAgentPayload) => {
    const res = http.post("/agents", payload);
    return res;
  },
  getAgents: async ({ limit, skip, subaccountId }: GetAgentsParams) => {
    const res = await http.get(`/agents/?subaccount_id=${subaccountId}`, {
      params: { limit, skip },
    });
    return res?.data;
  },
  getAgentById: async ({ agentId }: { agentId: string }) => {
    const res = await http.get(`/agents/${agentId}`);
    return res;
  },
  updateAgent: ({
    agentId,
    payload,
  }: {
    agentId: string;
    payload: UpdateAgentPayload;
  }) => {
    const res = http.patch(`/agents/${agentId}`, payload);
    return res;
  },
  deleteAgent: (agentId: string) => {
    const res = http.delete(`/agents/${agentId}`);
    return res;
  },
};
