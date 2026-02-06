import { Box, Typography } from "@mui/material";

export default function StatCommonCard({
  title,
  value,
  subText,
  upIcon,
}: {
  title: string;
  value: string;
  subText?: string;
  upIcon?: boolean;
}) {
  return (
    <Box
      className="
        bg-white border border-gray-200 rounded-[14px] w-full
        px-4 py-3
        sm:px-5 sm:py-4
      "
    >
      {/* Title */}
      <Typography
        sx={{
          fontSize: { xs: "12px", sm: "13px", md: "14px" },
          color: "#707070",
        }}
      >
        {title}
      </Typography>

      {/* Value + SubText */}
      <Box className="flex flex-wrap items-center gap-2 mt-7">
        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "22px", md: "26px" },
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        {subText && (
          <Box
            className="
              flex items-center gap-1
              px-2 py-0.5
              border border-gray-300 rounded
              text-gray-500
            "
            sx={{
              fontSize: { xs: "10px", sm: "11px" },
            }}
          >
            {upIcon ? (
              <img src="/assets/svgs/up_vector.svg" alt="Up" />
            ) : (
              <img src="/assets/svgs/down_stat_vector.svg" alt="Down" />
            )}
            {subText}
          </Box>
        )}
      </Box>
    </Box>
  );
}
