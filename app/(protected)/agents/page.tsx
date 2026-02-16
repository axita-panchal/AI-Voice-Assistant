"use client";

import { useSearchParams } from "next/navigation";
import AgentList from "./components/AgentList";
import AgentEditorShell from "./components/AgentEditorShell";

export default function AgentsPage() {
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("selected");

  if (!selectedId) {
    return <AgentList />;
  }

  return <AgentEditorShell agentId={selectedId} />;
}
