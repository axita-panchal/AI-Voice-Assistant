import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { userService } from "@/services/user.service";
import { CreateUserPayload, UpdateUserPayload } from "@/types/user.types";

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  errors?: Record<string, string>;
};

export type User = {
  id: string;
  account_id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_admin: boolean;
  is_agency_owner: boolean;
};

export type CreateUserResponse = {
  status_code: number;
  message: string;
  data: {
    user: User;
  };
};

/* ---------------- CREATE ---------------- */

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
        exact: false,
      });
    },
  });
};

/* ---------------- UPDATE ---------------- */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CreateUserResponse>,
    AxiosError<ApiErrorResponse>,
    UpdateUserPayload
  >({
    mutationFn: userService.updateUser,

    onSuccess: () => {
      // ✅ refetch ALL paginated user queries
      queryClient.invalidateQueries({
        queryKey: ["users"],
        exact: false,
      });
    },
  });
};
/* ---------------- DELETE ---------------- */

export const useDeleteUser = () => {
  const queryClient = useQueryClient(); // ✅ CORRECT PLACE

  return useMutation<
    AxiosResponse<CreateUserResponse>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
