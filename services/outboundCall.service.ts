import http from "./http";

export type OutboundCallRecipient = {
  name: string;
  phone_number: string;
};

export type OutboundCallRequest = {
  name: string;
  phone_number?: string | undefined;
};

export type OutboundCallResponse = {
  status_code?: number;
  message?: string;
};

export const outboundCallService = {
  requestCall: (payload: OutboundCallRequest) =>
    http.post<OutboundCallResponse>('/calls/place', payload),
};
