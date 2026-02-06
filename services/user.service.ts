import { CreateUserPayload, UpdateUserPayload } from "@/types/user.types";
import http from "./http";

type GetUsersParams = {
  limit: number;
  skip: number;
};

export const userService = {
  getUsers: ({ limit, skip }: GetUsersParams) => {
    return http.get("/users/get-users", {
      params: { limit, skip },
    });
  },

  getUserById: (id: string) => {
    return http.get(`/users/get-user/${id}`);
  },
  createUser: (payload: CreateUserPayload) => {
    return http.post("/users/create-user", payload);
  },
  deleteUser: (id: string) => {
    return http.delete(`/users/delete-user/${id}`);
  },
  updateUser: (payload: UpdateUserPayload) => {
    return http.patch(`/users/update-user/${payload?.id}`, payload);
  },
};
