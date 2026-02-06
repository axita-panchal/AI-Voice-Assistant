import { CreateAgentPayload } from "@/types/agent.types";
import http from "./http";

export const agentService = {
  createAgent: (payload: CreateAgentPayload) => {
    return http.post("/agents/create-agent", payload);
  },
};
