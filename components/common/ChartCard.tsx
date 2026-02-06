import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

export default function ChartCard({
  title,
  value,
  percentageValue,
  trend = "up",
  children,
}: {
  title: string;
  value: string;
  percentageValue?: string;
  trend?: "up" | "down";
  children: React.ReactNode;
}) {
  return (
    <Box className="bg-white rounded-2xl p-4 w-full border border-gray-200 mt-7">
      {/* Header row */}
      <Box className="flex justify-between items-start mb-2">
        <Typography className=" text-gray-500" sx={{ fontSize: "14px" }}>
          {title}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          sx={{
            fontSize: "10px",
            textTransform: "none",
            gap: "6px",
            minWidth: "auto",
            padding: "4px 8px",
          }}
        >
          Export
          <Image
            src="/assets/svgs/export.svg"
            alt="Export"
            width={12}
            height={12}
          />
        </Button>
      </Box>

      {/* Value + percentage */}
      <Box className="flex items-center gap-3 mb-4">
        <Typography
          sx={{
            fontSize: { xs: "24px" },
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        {percentageValue && (
          <Box
            className="
              flex items-center gap-1
              px-2 py-0.5
              border border-gray-300 rounded
              text-gray-500
            "
            sx={{ fontSize: { xs: "10px", sm: "11px" } }}
          >
            <Image
              src={
                trend === "up"
                  ? "/assets/svgs/up_vector.svg"
                  : "/assets/svgs/down_stat_vector.svg"
              }
              alt={trend === "up" ? "Up" : "Down"}
              width={10}
              height={10}
            />
            {percentageValue}
          </Box>
        )}
      </Box>

      {/* Chart */}
      {children}
    </Box>
  );
}
