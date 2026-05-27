import { GetAnalyticsParams } from "@/types/analytics.types";
import http from "./http";

export const analyticsService = {
  getAnalytics: async (params: GetAnalyticsParams) => {
    const res = await http.get("/analytics/", { params });
    return res?.data ?? null;
  },
};
