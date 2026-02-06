import { agentService } from "@/services/agent.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
