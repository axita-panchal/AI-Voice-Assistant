"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import AnalyticsChart from "@/components/charts/AnalyticsChart";
import ChartCard from "@/components/common/ChartCard";
import StatCommonCard from "@/components/common/StatCard";

import { useGetAnalytics } from "@/hooks/analytics/useAnalyticsQueries";

import { RootState } from "@/store";
import { Box, Button, Typography } from "@mui/material";
import { CustomFormSelect } from "@/components/common/CustomFormSelect";
import Image from "next/image";

const PERIOD_OPTIONS = [
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
] as const;

/**
 * Convert total_minutes (float) → "Xm Ys"
 */
const formatMinutes = (totalMinutes: number): string => {
  const mins = Math.floor(totalMinutes);
  const secs = Math.round((totalMinutes - mins) * 60);

  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;

  return `${mins}m ${secs}s`;
};

export default function Dashboard() {
  const [period, setPeriod] = useState<
    "this_week" | "this_month" | "monthly" | "yearly"
  >("this_month");

  const activeWorkspace = useSelector(
    (state: RootState) => state.workspace.activeWorkspace,
  );

  const { data: analyticsRes, isLoading } = useGetAnalytics({
    subaccount_id: activeWorkspace?.id ?? "",
    period,
  });

  const summary = analyticsRes?.summary;
  const chart_data = analyticsRes?.chart_data;

  return (
    <div className="bg-[#F6F8FB]">
      {/* KPI CARDS */}
      <Box className="flex items-center justify-between mb-4">
        <Typography
          sx={{
            fontSize: { xs: "13px", sm: "16px", md: "18px" },
            fontWeight: 600,
            color: "#707070",
          }}
        >
          Dashboard Overview
        </Typography>
        <div className="flex items-center justify-end gap-3">
          <Button
            size="small"
            variant="outlined"
            sx={{
              fontSize: "15px",
              textTransform: "none",
              gap: "10px",
              minWidth: "auto",
              height: "44px",
              padding: "10px 22px",
              borderRadius: "12px",
            }}
          >
            Export CSV
            <Image
              src="/assets/svgs/export.svg"
              alt="Export"
              width={12}
              height={12}
            />
          </Button>
          <CustomFormSelect
            label=""
            options={PERIOD_OPTIONS.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
            value={period}
            onChange={(e) =>
              setPeriod(
                e.target.value as
                  | "this_week"
                  | "this_month"
                  | "monthly"
                  | "yearly",
              )
            }
          />
        </div>
      </Box>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCommonCard
          title="Total Dials"
          value={String(summary?.total_dials ?? 0)}
        />

        <StatCommonCard
          title="Appointments Booked"
          value={String(summary?.appointments_booked ?? 0)}
        />

        <StatCommonCard
          title="Successful Transfers"
          value={String(summary?.successful_transfers ?? 0)}
        />

        <StatCommonCard
          title="Voicemails Left"
          value={String(summary?.voicemails_left ?? 0)}
        />

        <StatCommonCard
          title="Avg Call Time"
          value={summary?.average_call_time_formatted ?? "0s"}
        />
      </div>

      {/* FILTER + CHARTS */}
      <div className="mt-2 min-[1750px]:mt-6">
        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <ChartCard
            title="Total Dials"
            value={String(summary?.total_dials ?? 0)}
          >
            <AnalyticsChart data={chart_data} dataKey="dials" variant="bar" />
          </ChartCard>

          <ChartCard
            title="Total Minutes"
            value={
              summary?.total_minutes != null
                ? formatMinutes(summary.total_minutes)
                : "0m"
            }
          >
            <AnalyticsChart
              data={chart_data}
              dataKey="minutes"
              variant="line"
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
