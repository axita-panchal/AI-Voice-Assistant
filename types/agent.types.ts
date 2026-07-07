export type CreateAgentPayload = {
  name: string;
  phone_number_option: string;
  description?: string;
  subaccount_id: string;
};

export type AgentCalendar = {
  platform: string;
  unique_id: string;
  description?: string;
};

export type Agent = {
  id: string;
  name: string;
  language: string;
  phone_number_option: string;
  voice: string;
  subaccount_id: string;
  created_on: string;
  calendars?: AgentCalendar[];
};

export interface GetAgentsResponse {
  status_code: number;
  message: string;
  data: {
    agents: Agent[];
    skip: number;
    limit: number;
    totalCount: number;
  };
}

export interface GetAgentsParams {
  limit?: number;
  skip?: number;
  subaccountId: string;
}
