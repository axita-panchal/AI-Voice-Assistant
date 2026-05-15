import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import {
  outboundCallService,
  type OutboundCallRequest,
  type OutboundCallResponse,
} from "@/services/outboundCall.service";
import type { ApiErrorResponse } from "@/hooks/auth/useAuthMutations";

export function useOutboundCall() {
  return useMutation<
    AxiosResponse<OutboundCallResponse>,
    AxiosError<ApiErrorResponse>,
    OutboundCallRequest
  >({
    mutationFn: outboundCallService.requestCall,
  });
}
