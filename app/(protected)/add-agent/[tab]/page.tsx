"use client";

import { useParams } from "next/navigation";
import AgentPrompt from "@/components/add-agent/AgentPrompt";
import AddAgentShell from "../AddAgentShell";
import AgentAction from "@/components/add-agent/AgentAction";
import KnowledgeBase from "@/components/add-agent/KnowledgeBase";

export default function AddAgentTabPage() {
  const params = useParams<{ tab: string }>();
  const tab = params?.tab;

  let content;

  switch (tab) {
    case "agent-prompt":
      content = <AgentPrompt />;
      break;
    case "action":
      content = <AgentAction />;
      break;

    case "knowledge-base":
      content = <KnowledgeBase />;
      break;

    default:
      content = <div className="p-6 text-gray-500"> Tab name: {tab}</div>;
  }

  return <AddAgentShell>{content}</AddAgentShell>;
}
