import { CreateUserPayload, UpdateUserPayload } from "@/types/user.types";
import http from "./http";

type GetUsersParams = {
  limit: number;
  skip: number;
};

export const userService = {
  getUsers: async ({ limit, skip }: GetUsersParams) => {
    const res = await http.get("/users", {
      params: { limit, skip },
    });
    return res?.data || [];
  },

  getUserById: async (id: string) => {
    const res = await http.get(`/users/${id}`);
    return res;
  },
  createUser: async (payload: CreateUserPayload) => {
    const res = await http.post("/users", payload);
    return res;
  },
  deleteUser: async (id: string) => {
    const res = await http.delete(`/users/${id}`);
    return res;
  },
  updateUser: async (payload: UpdateUserPayload) => {
    const res = await http.patch(`/users/${payload?.id}`, payload);
    return res;
  },
};
