"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface AnalyticsChartItem {
  label: string;
  dials: number;
  minutes: number;
}

interface AnalyticsChartProps {
  data: AnalyticsChartItem[];

  // which metric to render
  dataKey: "dials" | "minutes";

  // chart type
  variant: "bar" | "line";

  // optional custom color
  color?: string;
}

export default function AnalyticsChart({
  data,
  dataKey,
  variant,
  color = "#3B82F6",
}: AnalyticsChartProps) {
  const commonProps = {
    data,
  };

  const commonAxisProps = {
    tick: { fontSize: 10, fill: "#9CA3AF" },
    axisLine: false,
    tickLine: false,
  };

  const tooltipFormatter = (value: number | string | undefined) =>
    dataKey === "minutes"
      ? [`${value ?? 0} min`, "Minutes"]
      : [value ?? 0, "Dials"];

  return (
    <div className="h-65 min-[1750px]:h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {variant === "bar" ? (
          <BarChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis dataKey="label" {...commonAxisProps} />

            <YAxis {...commonAxisProps} />

            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
              cursor={{
                fill: "#EFF6FF",
              }}
            />

            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[6, 6, 0, 0]}
              barSize={10}
            />
          </BarChart>
        ) : (
          <LineChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5EDFF"
            />

            <XAxis dataKey="label" {...commonAxisProps} />

            <YAxis {...commonAxisProps} />

            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{
                r: 3,
                fill: color,
              }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
