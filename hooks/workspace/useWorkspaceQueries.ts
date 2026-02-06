import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";

export const useWorkspaceById = (id?: string | number) =>
  useQuery({
    queryKey: ["workspace", id],
    queryFn: () => workspaceService.getWorkspaceById(String(id)),
    enabled: Boolean(id),
  });

export const useAllWorkspaces = (skip = 0, limit = 20) =>
  useQuery({
    queryKey: ["allWorkspaces", skip, limit],
    queryFn: () => workspaceService.getAllWorkspaces(skip, limit),
  });
