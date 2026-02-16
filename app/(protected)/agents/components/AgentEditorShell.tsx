"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LeftForm from "./LeftForm";
import AgentTabs from "./AgentTabs";

import AgentPrompt from "@/components/add-agent/AgentPrompt";
import AgentAction from "@/components/add-agent/AgentAction";
import KnowledgeBase from "@/components/add-agent/KnowledgeBase";
import { useUpdateAgent } from "@/hooks/agent/useAgentMutations";
import { useAgentById } from "@/hooks/agent/useAgentQueries";
import { toast } from "@/utils/toast";

type Props = {
  agentId: string;
};

type AgentForm = {
  name: string;
  description: string;
  openingLine: string;
  language: string;
  voice: string;
};

export default function AgentEditorShell({ agentId }: Props) {
  const router = useRouter();
  const { mutateAsync: updateAgent, isPending: isUpdatingAgent } =
    useUpdateAgent();
  const { data: agentData, isPending } = useAgentById(agentId);
  console.log("agentData: ", agentData);

  const searchParams = useSearchParams();
  const activeTab = searchParams.get("setting") || "agent-prompt";

  const updateAgentDataById = async () => {
    try {
      const response = await updateAgent({
        agentId,
        payload: form,
      });

      console.log("Updated:", response.data);
      if (response.data?.status_code === 200) {
        toast.success(response.data?.message || "Agent updated successfully");
        router.push("/agents");
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  useEffect(() => {
    if (!agentData?.data) return;

    const agent = agentData.data?.data?.agent;

    setForm({
      name: agent.name ?? "",
      description: "",
      openingLine: "",
      language: agent.language ?? "English",
      voice: agent.voice,
    });
  }, [agentData?.data?.data?.agent]);

  const [form, setForm] = useState<AgentForm>({
    name: "",
    description: "",
    openingLine: "",
    language: "English",
    voice: "Joseph (English)",
  });

  let content;

  switch (activeTab) {
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
      content = <div className="p-6">No content</div>;
  }

  return (
    <div className="bg-[#F6F8FB] min-h-screen h-full  lg:min-h-0 p-4 sm:p-6">
      {/* MOBILE LAYOUT */}
      <div className="lg:hidden p-4 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <LeftForm
            form={form}
            setForm={setForm}
            onPublish={updateAgentDataById}
            isUpdating={isPending}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200">
          <AgentTabs agentId={agentId} activeTab={activeTab} />
          <div className="p-5">{content}</div>
        </div>
      </div>

      <div className="hidden lg:flex min-h-screen bg-[#F6F8FB] items-start justify-center ">
        <div className="w-full max-w-[1400px] h-[85vh] bg-white rounded-2xl border border-gray-200 flex overflow-hidden shadow-sm">
          {/* LEFT PANEL */}
          <aside className="w-96 border-r border-gray-200 p-6 overflow-y-auto">
            <LeftForm
              form={form}
              setForm={setForm}
              onPublish={updateAgentDataById}
              isUpdating={isPending}
            />
          </aside>

          {/* RIGHT PANEL */}
          <section className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="shrink-0 border-b border-gray-200">
              <AgentTabs agentId={agentId} activeTab={activeTab} />
            </div>

            {/* Scroll area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 max-w-5xl mx-auto">{content}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
