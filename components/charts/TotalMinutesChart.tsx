"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/**
 * Raw data from API / backend
 * Only days with data
 */
const rawData = [
  { day: 3, value: 0.5 },
  { day: 4, value: 1 },
  { day: 6, value: 2.2 },
  { day: 7, value: 1 },
  { day: 9, value: 0.85 },
  { day: 11, value: 1.2 },
  { day: 12, value: 2.3 },
  { day: 14, value: 0.75 },
  { day: 15, value: 0.75 },
  { day: 18, value: 1.1 },
  { day: 19, value: 0.8 },
];

/**
 * Normalize days 01–31
 */
const generateMonthlyData = (raw: { day: number; value: number }[]) => {
  const map = new Map(raw.map((item) => [item.day, item.value]));

  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return {
      day: day.toString().padStart(2, "0"),
      value: map.get(day) ?? 0,
    };
  });
};

export default function TotalMinutesChart() {
  const data = generateMonthlyData(rawData);

  return (
    <div className="w-full h-75">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5EDFF"
          />

          {/* X Axis */}
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            formatter={(value) => {
              if (value == null) return ["", "Minutes"];
              return [`${value} min`, "Minutes"];
            }}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              fontSize: "12px",
            }}
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{
              r: 3,
              fill: "#3B82F6",
            }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
