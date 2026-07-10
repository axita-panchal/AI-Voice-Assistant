import { agentService } from "@/services/agent.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse } from "../auth/useAuthMutations";
import { AxiosError, AxiosResponse } from "axios";
import { Agent, AgentCalendar } from "@/types/agent.types";

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
  name?: string;
  description?: string;
  first_message?: string;
  voice?: string;
  language?: string;
  calendars?: AgentCalendar[];
  transfer_phone_number?: string;
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

/* -------- Calendar Mutations -------- */

export const useAddCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<{
      status_code: number;
      message: string;
      data: AgentCalendar;
    }>,
    AxiosError<ApiErrorResponse>,
    { agentId: string; calendar: AgentCalendar }
  >({
    mutationFn: ({ agentId, calendar }) =>
      agentService.addCalendar({ agentId, calendar }),
    onSuccess: (_, { agentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["agents", agentId],
      });
    },
  });
};

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<{
      status_code: number;
      message: string;
      data: AgentCalendar;
    }>,
    AxiosError<ApiErrorResponse>,
    {
      agentId: string;
      uniqueId: string;
      calendar: Partial<AgentCalendar>;
    }
  >({
    mutationFn: ({ agentId, uniqueId, calendar }) =>
      agentService.updateCalendar({ agentId, uniqueId, calendar }),
    onSuccess: (_, { agentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["agents", agentId],
      });
    },
  });
};

export const useDeleteCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<{ status_code: number; message: string }>,
    AxiosError<ApiErrorResponse>,
    { agentId: string; uniqueId: string }
  >({
    mutationFn: ({ agentId, uniqueId }) =>
      agentService.deleteCalendar({ agentId, uniqueId }),
    onSuccess: (_, { agentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["agents", agentId],
      });
    },
  });
};

/* -------- Knowledge Base Mutations -------- */

export const useUploadKnowledgeBase = () => {
  return useMutation<
    AxiosResponse<{ status_code: number; message: string; data: unknown }>,
    AxiosError<ApiErrorResponse>,
    { agentId: string; files: File[] }
  >({
    mutationFn: ({ agentId, files }) =>
      agentService.uploadKnowledgeBase({ agentId, files }),
  });
};

export const useDeleteKnowledgeBaseFile = () => {
  return useMutation<
    AxiosResponse<{ status_code: number; message: string }>,
    AxiosError<ApiErrorResponse>,
    { agentId: string; fileName: string }
  >({
    mutationFn: ({ agentId, fileName }) =>
      agentService.deleteKnowledgeBaseFile({ agentId, fileName }),
  });
};
