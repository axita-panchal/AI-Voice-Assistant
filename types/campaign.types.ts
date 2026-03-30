import { Agent } from "./agent.types";

interface BaseCampaignPayload {
  name: string;
  start_time?: string;
  end_time?: string;
  min_calls_per_hour?: number;
  max_calls_per_hour?: number;
  daily_usage_cap?: number;
  max_dials_per_contact?: number;
}

export interface CreateCampaignPayload extends BaseCampaignPayload {
  agent_id: string;
}

export interface UpdateCampaignPayload extends BaseCampaignPayload {
  agent_id: string;
  is_active?: boolean;
}

export interface UpdateCampaignVariables {
  campaignId: string;
  payload: UpdateCampaignPayload;
}

export interface Campaign {
  id: string;
  name: string;
  agent_id: string;
  agent: Agent;
  start_time: string;
  end_time: string;
  min_calls_per_hour: number;
  max_calls_per_hour: number;
  daily_usage_cap: number;
  max_dials_per_contact: number;
  dials: number;
  outcome_appointment_booked: number;
  outcome_callback_requested: number;
  outcome_do_not_call: number;
  outcome_failed: number;
  outcome_follow_up: number;
  outcome_no_answer: number;
  outcome_not_interested: number;
  outcome_transferred: number;
  outcome_wrong_number: number;
  is_active: boolean;
  total_min_used_today: number;
  total_min_used: number;
  total_pickups: number;
  total_positive_outcomes: number;
  calling_days?: string[];
  actions?: string;
}
