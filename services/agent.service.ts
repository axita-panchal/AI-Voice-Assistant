import {
  CreateAgentPayload,
  GetAgentsParams,
  AgentCalendar,
} from "@/types/agent.types";
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

  /* -------- Calendar Methods -------- */

  addCalendar: ({
    agentId,
    calendar,
  }: {
    agentId: string;
    calendar: AgentCalendar;
  }) => {
    const res = http.post(`/agents/${agentId}/calendars`, calendar);
    return res;
  },

  updateCalendar: ({
    agentId,
    uniqueId,
    calendar,
  }: {
    agentId: string;
    uniqueId: string;
    calendar: Partial<AgentCalendar>;
  }) => {
    const res = http.patch(
      `/agents/${agentId}/calendars/${uniqueId}`,
      calendar,
    );
    return res;
  },

  deleteCalendar: ({
    agentId,
    uniqueId,
  }: {
    agentId: string;
    uniqueId: string;
  }) => {
    const res = http.delete(`/agents/${agentId}/calendars/${uniqueId}`);
    return res;
  },

  /* -------- Knowledge Base Methods -------- */

  uploadKnowledgeBase: ({
    agentId,
    files,
  }: {
    agentId: string;
    files: File[];
  }) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = http.post(`/agents/${agentId}/knowledge_base`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  },

  deleteKnowledgeBaseFile: ({
    agentId,
    fileName,
  }: {
    agentId: string;
    fileName: string;
  }) => {
    const res = http.delete(
      `/agents/${agentId}/knowledge_base/${encodeURIComponent(fileName)}`,
    );
    return res;
  },
};
