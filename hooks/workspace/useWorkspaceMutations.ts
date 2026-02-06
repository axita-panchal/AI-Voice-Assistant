import { workspaceService } from "@/services/workspace.service";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  errors?: Record<string, string>;
};

export type CreateWorkSpacePayload = {
  name: string;
  description?: string;
};

export type UpdateWorkSpacePayload = {
  name: string;
  description?: string;
  id: number;
};

export type Workspace = {
  id: string;
  name: string;
  description?: string;
};

export type CreateWorkspaceResponse = {
  status_code: number;
  message: string;
  data: {
    subaccount: Workspace;
  };
};

export const useCreateWorkspace = () =>
  useMutation<
    AxiosResponse<CreateWorkspaceResponse>,
    AxiosError<ApiErrorResponse>,
    CreateWorkSpacePayload
  >({
    mutationFn: workspaceService.createWorkspace,
  });

export const useUpdateWorkspace = () =>
  useMutation<
    AxiosResponse<CreateWorkspaceResponse>,
    AxiosError<ApiErrorResponse>,
    UpdateWorkSpacePayload
  >({
    mutationFn: workspaceService.updateWorkspace,
  });

export const useDeleteWorkspace = () =>
  useMutation<
    AxiosResponse<CreateWorkspaceResponse>,
    AxiosError<ApiErrorResponse>,
    number
  >({
    mutationFn: (id: number) => workspaceService.deleteWorkspace(id),
  });
