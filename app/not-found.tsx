"use client";

import { Box, Button, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Box className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <Box className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border">
        {/* Icon */}
        <Box className="flex justify-center mb-4">
          <Box className="bg-blue-50 p-3 rounded-full">
            <SentimentDissatisfiedIcon
              sx={{ fontSize: 40, color: "#2563EB" }}
            />
          </Box>
        </Box>

        {/* Title */}
        <Typography sx={{ fontSize: 32, fontWeight: 600, color: "#111827" }}>
          404
        </Typography>

        <Typography sx={{ fontSize: 18, fontWeight: 500, mt: 1 }}>
          Page not found
        </Typography>

        {/* Description */}
        <Typography className="text-gray-500 mt-2 text-sm">
          The page you are looking for doesn’t exist or may have been moved.
        </Typography>

        {/* Actions */}
        <Box className="flex gap-3 mt-6">
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push("/dashboard")}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              backgroundColor: "#2563EB",
              "&:hover": { backgroundColor: "#1D4ED8" },
            }}
          >
            Go to dashboard
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => router.back()}
            sx={{ textTransform: "none", borderRadius: "10px" }}
          >
            Go back
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
