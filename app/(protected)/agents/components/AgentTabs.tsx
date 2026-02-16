"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const TABS = [
  {
    label: "Agent Prompt",
    slug: "agent-prompt",
    icon: "/assets/svgs/magic.svg",
  },
  { label: "Action", slug: "action", icon: "/assets/svgs/thunder.svg" },
  {
    label: "Knowledge Base",
    slug: "knowledge-base",
    icon: "/assets/svgs/tabler_book.svg",
  },
  { label: "Advanced", slug: "advanced", icon: "/assets/svgs/uil_setting.svg" },
];

export default function AgentTabs({
  agentId,
  activeTab,
  onAddPrompt,
}: {
  agentId: string;
  activeTab: string;
  onAddPrompt?: () => void;
}) {
  const router = useRouter();

  const handleTabClick = (slug: string) => {
    router.push(`/agents?selected=${agentId}&setting=${slug}`);
  };

  return (
    <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        {/* Tabs */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.slug;

              return (
                <button
                  key={tab.slug}
                  onClick={() => handleTabClick(tab.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border whitespace-nowrap shrink-0 transition cursor-pointer
                    ${
                      isActive
                        ? "bg-[#2F6AFF1A] border-blue-600 text-[#2F6AFF]"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={16}
                    height={16}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {activeTab === "agent-prompt" && (
            <button
              onClick={onAddPrompt}
              className="px-4 py-2 text-sm rounded-lg bg-gradient-to-b from-[#9450FF] to-[#435CFE] text-white whitespace-nowrap"
            >
              ✨ Add Prompt
            </button>
          )}

          <button className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white whitespace-nowrap">
            📞 Call Me
          </button>
        </div>
      </div>
    </div>
  );
}
