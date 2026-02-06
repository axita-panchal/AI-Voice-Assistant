"use client";

import { useRouter, usePathname } from "next/navigation";
import { Tabs, Tab, Box } from "@mui/material";
import { SETTINGS_TABS } from "@/components/settings/tabs";

export default function SettingsShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop();

  return (
    <div className="h-full min-h-0 flex flex-col bg-[#F6F8FB]">
      {/* Centered container */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col flex-1 pt-4 sm:pt-6">
        {/* Tabs wrapper */}
        <Box className="bg-white rounded-xl p-2 mb-4 sm:mb-6">
          <Tabs
            value={currentTab}
            onChange={(_, value) => router.push(`/settings/${value}`)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              minHeight: 40,
              "& .MuiTabs-flexContainer": {
                gap: "4px",
              },
            }}
          >
            {SETTINGS_TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                className="normal-case!"
                sx={{
                  borderRadius: "8px",
                  fontWeight: 500,
                  minHeight: 36,
                  px: { xs: 1.5, sm: 2.5 },
                  fontSize: { xs: 13, sm: 14 },
                  "&.Mui-selected": {
                    backgroundColor: "#EEF2FF",
                    color: "#3B5BFF",
                  },
                  background: "#F6F8FB",
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-4 sm:pb-6">{children}</div>
      </div>
    </div>
  );
}
