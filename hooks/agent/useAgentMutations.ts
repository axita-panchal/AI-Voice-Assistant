import { agentService } from "@/services/agent.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse } from "../auth/useAuthMutations";
import { AxiosError, AxiosResponse } from "axios";
import { Agent } from "@/types/agent.types";

export type CreateAgentResponse = {
  status_code: number;
  message: string;
  data: {
    agent: Agent;
  };
};
export interface DeleteAgentResponse {
  status_code: number;
  message: string;
}
export type UpdateAgentPayload = {
  voice: string;
  language: string;
};

export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: agentService.createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
        exact: false,
      });
    },
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CreateAgentResponse>,
    AxiosError<ApiErrorResponse>,
    { agentId: string; payload: UpdateAgentPayload }
  >({
    mutationFn: ({ agentId, payload }) =>
      agentService.updateAgent({ agentId, payload }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
        exact: false,
      });

      // optional: invalidate single agent cache
      queryClient.invalidateQueries({
        queryKey: ["agents", variables.agentId],
      });
    },
  });
};

/* ---------------- DELETE ---------------- */

export const useDeleteAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<DeleteAgentResponse>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: (id: string) => agentService.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
};
