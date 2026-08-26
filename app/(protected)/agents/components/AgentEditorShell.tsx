"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LeftForm from "./LeftForm";
import AgentTabs from "./AgentTabs";

import AgentPrompt from "@/components/add-agent/AgentPrompt";
import AddPromptModal from "@/components/add-agent/AddPromptModal";
import AgentAction from "@/components/add-agent/AgentAction";
import KnowledgeBase from "@/components/add-agent/KnowledgeBase";
import { useUpdateAgent } from "@/hooks/agent/useAgentMutations";
import { useAgentById } from "@/hooks/agent/useAgentQueries";
import { AgentCalendar } from "@/types/agent.types";
import { toast } from "@/utils/toast";

type Props = {
  agentId: string;
};

type AgentForm = {
  name: string;
  description: string;
  first_message: string;
  language: string;
  voice: string;
};

export default function AgentEditorShell({ agentId }: Props) {
  const router = useRouter();
  const { mutateAsync: updateAgent, isPending: isUpdatingAgent } =
    useUpdateAgent();
  const { data: agentData, isPending } = useAgentById(agentId);
  const [isAddingCalendar, setIsAddingCalendar] = useState(false);
  const [calendars, setCalendars] = useState<AgentCalendar[]>([]);
  const [transferPhoneNumber, setTransferPhoneNumber] = useState<string>("");
  const [isUpdatingTransfer, setIsUpdatingTransfer] = useState(false);
  const [prompt, setPrompt] = useState<string>("");
  const [isUpdatingPrompt, setIsUpdatingPrompt] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const activeTab = searchParams.get("setting") || "agent-prompt";

  const updateAgentDataById = async () => {
    try {
      const response = await updateAgent({
        agentId,
        payload: {
          ...form,
          ...(prompt ? { prompt } : {}),
        },
      });

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
      description: agent?.description ?? "",
      language: agent.language ?? "English",
      voice: agent.voice,
      first_message: agent?.first_message ?? "",
    });

    setCalendars(agent.calendars ?? []);
    setTransferPhoneNumber(agent.transfer_phone_number ?? "");
    setPrompt(agent.prompt ?? "");
  }, [agentData?.data?.data?.agent]);

  const handleAddCalendar = async (newCalendar: AgentCalendar) => {
    const updatedCalendars = [...calendars, newCalendar];

    try {
      setIsAddingCalendar(true);

      const response = await updateAgent({
        agentId,
        payload: { calendars: updatedCalendars },
      });

      if (response.data?.status_code === 200) {
        setCalendars(updatedCalendars);
        toast.success(response.data?.message || "Calendar added successfully");
      }
    } catch (error) {
      console.error("Failed to add calendar", error);
      toast.error("Failed to add calendar");
      throw error;
    } finally {
      setIsAddingCalendar(false);
    }
  };

  const handleCalendarUpdate = (updatedCalendars: AgentCalendar[]) => {
    setCalendars(updatedCalendars);
    toast.success("Calendar updated successfully");
  };

  const handleCalendarDelete = (updatedCalendars: AgentCalendar[]) => {
    setCalendars(updatedCalendars);
    toast.success("Calendar deleted successfully");
  };

  const handleSaveTransferPhoneNumber = async (phoneNumber: string) => {
    try {
      setIsUpdatingTransfer(true);

      const response = await updateAgent({
        agentId,
        payload: { transfer_phone_number: phoneNumber },
      });

      if (response.data?.status_code === 200) {
        setTransferPhoneNumber(phoneNumber);
        toast.success("Transfer phone number saved successfully");
      }
    } catch (error) {
      console.error("Failed to save transfer phone number", error);
      toast.error("Failed to save transfer phone number");
      throw error;
    } finally {
      setIsUpdatingTransfer(false);
    }
  };

  const handleDeleteTransferPhoneNumber = async () => {
    try {
      setIsUpdatingTransfer(true);

      const response = await updateAgent({
        agentId,
        payload: { transfer_phone_number: "" },
      });

      if (response.data?.status_code === 200) {
        setTransferPhoneNumber("");
        toast.success("Transfer phone number deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete transfer phone number", error);
      toast.error("Failed to delete transfer phone number");
      throw error;
    } finally {
      setIsUpdatingTransfer(false);
    }
  };

  const handleSavePrompt = async (newPrompt: string) => {
    try {
      setIsUpdatingPrompt(true);

      const response = await updateAgent({
        agentId,
        payload: { prompt: newPrompt },
      });

      if (response.data?.status_code === 200) {
        setPrompt(newPrompt);
        toast.success(response.data?.message || "Prompt saved successfully");
        setIsPromptModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to save prompt", error);
      toast.error("Failed to save prompt");
      throw error;
    } finally {
      setIsUpdatingPrompt(false);
    }
  };

  const [form, setForm] = useState<AgentForm>({
    name: "",
    description: "",
    first_message: "",
    language: "English",
    voice: "Joseph (English)",
  });

  let content;

  switch (activeTab) {
    case "agent-prompt":
      content = (
        <AgentPrompt
          prompt={prompt}
          onOpenPromptModal={() => setIsPromptModalOpen(true)}
          isLoading={isPending}
        />
      );
      break;
    case "action":
      content = (
        <AgentAction
          agentId={agentId}
          calendars={calendars}
          onAddCalendar={handleAddCalendar}
          isAddingCalendar={isAddingCalendar}
          onCalendarUpdate={handleCalendarUpdate}
          onCalendarDelete={handleCalendarDelete}
          transferPhoneNumber={transferPhoneNumber}
          onSaveTransferPhoneNumber={handleSaveTransferPhoneNumber}
          onDeleteTransferPhoneNumber={handleDeleteTransferPhoneNumber}
          isUpdatingTransfer={isUpdatingTransfer}
        />
      );
      break;
    case "knowledge-base":
      content = <KnowledgeBase agentId={agentId} />;
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
            isUpdating={isUpdatingAgent}
            agentDataByIdLoading={isPending}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200">
          <AgentTabs
            agentId={agentId}
            activeTab={activeTab}
            onAddPrompt={() => setIsPromptModalOpen(true)}
            hasPrompt={!!prompt?.trim()}
          />
          <div className="p-5">{content}</div>
        </div>
      </div>

      <div className="hidden lg:flex min-h-screen bg-[#F6F8FB] items-start justify-center ">
        <div className="w-full max-w-[1400px] h-[85vh] bg-white rounded-2xl border border-gray-200 flex overflow-hidden shadow-sm">
          {/* LEFT PANEL */}
          <aside className="w-96 border-r border-gray-200 p-6 overflow-y-auto custom-scroll">
            <LeftForm
              form={form}
              setForm={setForm}
              onPublish={updateAgentDataById}
              isUpdating={isUpdatingAgent}
              agentDataByIdLoading={isPending}
            />
          </aside>

          {/* RIGHT PANEL */}
          <section className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="shrink-0 border-b border-gray-200">
              <AgentTabs
                agentId={agentId}
                activeTab={activeTab}
                onAddPrompt={() => setIsPromptModalOpen(true)}
                hasPrompt={!!prompt?.trim()}
              />
            </div>

            {/* Scroll area */}
            <div className="flex-1 overflow-y-auto custom-scroll">
              <div className="p-6 max-w-5xl mx-auto">{content}</div>
            </div>
          </section>
        </div>
      </div>

      {/* ADD / EDIT PROMPT MODAL */}
      <AddPromptModal
        open={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onSave={handleSavePrompt}
        initialPrompt={prompt}
        isSubmitting={isUpdatingPrompt}
      />
    </div>
  );
}
