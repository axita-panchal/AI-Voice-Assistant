import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export const useTeamMemberUserById = (id?: string | number) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(String(id)),
    enabled: Boolean(id),
  });

export const useTeamMemberUsers = (limit: number, skip: number) =>
  useQuery({
    queryKey: ["users", limit, skip],
    queryFn: () => userService.getUsers({ limit, skip }),
    placeholderData: keepPreviousData,
    staleTime: 0, // ✅ force refetch on invalidate
  });
