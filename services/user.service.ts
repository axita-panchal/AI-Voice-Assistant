import { CreateUserPayload, UpdateUserPayload } from "@/types/user.types";
import http from "./http";

type GetUsersParams = {
  limit: number;
  skip: number;
};

export const userService = {
  getUsers: ({ limit, skip }: GetUsersParams) => {
    return http.get("/users", {
      params: { limit, skip },
    });
  },

  getUserById: (id: string) => {
    return http.get(`/users/${id}`);
  },
  createUser: (payload: CreateUserPayload) => {
    return http.post("/users", payload);
  },
  deleteUser: (id: string) => {
    return http.delete(`/users/${id}`);
  },
  updateUser: (payload: UpdateUserPayload) => {
    return http.patch(`/users/${payload?.id}`, payload);
  },
};
