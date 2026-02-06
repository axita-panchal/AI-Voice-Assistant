import {
  CreateWorkSpacePayload,
  UpdateWorkSpacePayload,
} from "@/hooks/workspace/useWorkspaceMutations";
import http from "./http";

export const workspaceService = {
  getAllWorkspaces: async (skip = 0, limit = 20) => {
    const res = await http.get("/subaccount/list-subaccounts", {
      params: { skip, limit },
    });
    return res.data;
  },

  getWorkspaceById: (id: string) => {
    return http.get(`/subaccount/get-subaccount/${id}`);
  },
  createWorkspace: (payload: CreateWorkSpacePayload) => {
    return http.post("/subaccount/create-subaccount", payload);
  },
  deleteWorkspace: (id: number) => {
    return http.delete(`/subaccount/delete-subaccount/${id}`);
  },
  updateWorkspace: (payload: UpdateWorkSpacePayload) => {
    return http.patch(`/subaccount/update-subaccount/${payload?.id}`, payload);
  },
};
