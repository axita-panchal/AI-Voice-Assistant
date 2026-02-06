"use client";

import SettingsShell from "../SettingsShell";
import GeneralSettings from "@/components/settings/GeneralSettings";
import TeamMemberSettings from "@/components/settings/TeamMemberSettings";
import WorkSpaceSettings from "@/components/settings/WorkSpaceSettings";
import { usePathname } from "next/navigation";
import { JSX } from "react";

const TAB_COMPONENTS: Record<string, JSX.Element> = {
  general: <GeneralSettings />,
  "team-members": <TeamMemberSettings />,
  workspaces: <WorkSpaceSettings />,
};

export default function SettingsTabPage() {
  const pathname = usePathname();
  const currentTab = pathname?.split("/").pop() || "general";

  return (
    <SettingsShell>
      {TAB_COMPONENTS[currentTab] ?? <GeneralSettings />}
    </SettingsShell>
  );
}
