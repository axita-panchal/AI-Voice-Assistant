export interface DailyDataPoint {
  day: number;
  value: number;
}

// ── Per-agent breakdown ──────────────────────────────────────────────────────
export interface AnalyticsAgent {
  agent_id: string;
  agent_name: string;
  total_dials: number;
  total_outcomes: number;
  total_seconds: number;
  total_minutes: number;
  completed_calls: number;
  no_answer_calls: number;
  busy_calls: number;
  failed_calls: number;
  canceled_calls: number;
  answer_rate_pct: number;
  avg_call_duration_seconds: number;
  appointments_booked: number;
  voicemails_left: number;
  successful_transfers: number;
  failed_transfers: number;
  average_call_time_formatted: string;
}

// ── Individual call log ──────────────────────────────────────────────────────
export interface AnalyticsCallLog {
  id: string;
  call_sid: string;
  agent_name: string;
  contact_name: string;
  from_number: string;
  to_number: string;
  direction: string;
  status: string;
  duration_seconds: number;
  is_appointment_booked: boolean;
  is_transferred: boolean;
  is_voicemail: boolean;
  is_transfer_failed: boolean;
  started_at: string;
  ended_at: string;
  created_at: string;
}

// ── Summary block ────────────────────────────────────────────────────────────
export interface AnalyticsSummary {
  total_dials: number;
  total_outcomes: number;
  total_seconds: number;
  total_minutes: number;
  answer_rate_pct: number;
  avg_call_duration_seconds: number;
  appointments_booked: number;
  voicemails_left: number;
  successful_transfers: number;
  failed_transfers: number;
  average_call_time_formatted: string;
}

// ── Full API response ────────────────────────────────────────────────────────
export interface AnalyticsResponse {
  summary: AnalyticsSummary;
  agents: AnalyticsAgent[];
  call_logs: AnalyticsCallLog[];
  skip: number;
  limit: number;
  total_call_logs: number;
}

// ── Query params ─────────────────────────────────────────────────────────────
export interface GetAnalyticsParams {
  subaccount_id: string;
  start_date?: string;
  end_date?: string;
  skip?: number;
  limit?: number;
  period?: "this_week" | "this_month" | "monthly" | "yearly";
}
