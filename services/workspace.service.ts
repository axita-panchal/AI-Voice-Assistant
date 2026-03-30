import {
  CreateWorkSpacePayload,
  UpdateWorkSpacePayload,
} from "@/hooks/workspace/useWorkspaceMutations";
import http from "./http";

export const workspaceService = {
  getAllWorkspaces: async (skip = 0, limit = 20) => {
    const res = await http.get("/subaccount", {
      params: { skip, limit },
    });
    return res.data;
  },

  getWorkspaceById: (id: string) => {
    const res = http.get(`/subaccount/${id}`);
    return res;
  },
  createWorkspace: (payload: CreateWorkSpacePayload) => {
    const res = http.post("/subaccount/", payload);
    return res;
  },
  deleteWorkspace: (id: number) => {
    const res = http.delete(`/subaccount/${id}`);
    return res;
  },
  updateWorkspace: (payload: UpdateWorkSpacePayload) => {
    const res = http.patch(`/subaccount/${payload?.id}`, payload);
    return res;
  },
};
