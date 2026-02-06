"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  const handleHome = () => {
    const loggedIn = Boolean(localStorage.getItem("token"));

    if (loggedIn) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Something went wrong
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Don’t worry, it’s not you. Please try again.
        </p>

        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 text-left text-xs text-red-500 bg-red-50 p-3 rounded">
            {error.message}
          </pre>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="contained"
            onClick={reset}
            className="bg-indigo-600! hover:bg-indigo-700!"
          >
            Retry
          </Button>

          <Button variant="outlined" onClick={handleHome}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
