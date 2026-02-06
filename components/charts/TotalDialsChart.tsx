"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const rawData = [
  { day: 3, value: 2 },
  { day: 5, value: 1.2 },
  { day: 7, value: 1.7 },
  { day: 12, value: 1 },
];

const generateMonthlyData = (rawData: { day: number; value: number }[]) => {
  const map = new Map(rawData.map((item) => [item.day, item.value]));

  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return {
      day: day.toString().padStart(2, "0"),
      value: map.get(day) ?? 0,
    };
  });
};

export default function TotalDialsChart() {
  const data = generateMonthlyData(rawData);

  return (
    <div className="w-full h-75">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#3B82F6"
            radius={[6, 6, 6, 6]}
            barSize={10}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
