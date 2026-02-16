"use client";

import {
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const TABS = [
  { label: "Agent Prompt", slug: "agent-prompt" },
  { label: "Action", slug: "action" },
  { label: "Knowledge Base", slug: "knowledge-base" },
  { label: "Advanced", slug: "advanced" },
];

type AgentForm = {
  name: string;
  description: string;
  openingLine: string;
  language: string;
  voice: string;
};

type LeftFormProps = {
  form: AgentForm;
  setForm: React.Dispatch<React.SetStateAction<AgentForm>>;
};

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

export default function AddAgentShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.split("/").pop();

  const [form, setForm] = useState<AgentForm>({
    name: "John",
    description: "Make it good",
    openingLine: "Hey {{contactFirstName}}?",
    language: "English",
    voice: "Joseph",
  });

  const [isPromptOpen, setPromptOpen] = useState(false);

  return (
    <div className="h-full min-h-screen lg:min-h-0 p-4 sm:p-6">
      {/* <div className="h-full min-h-screen p-4 sm:p-6"> */}
      <div className="bg-white rounded-2xl border border-gray-200 h-full flex flex-col lg:flex-row overflow-hidden">
        {/* ================= LEFT SECTION ================= */}
        <div className="w-full lg:w-90 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 px-4 sm:px-6 py-6">
          <LeftForm form={form} setForm={setForm} />
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* HEADER (TABS + ACTIONS IN ONE ROW) */}
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
                        onClick={() => router.push(`/add-agent/${tab.slug}`)}
                        className={`px-4 py-2 rounded-full text-sm border whitespace-nowrap transition cursor-pointer 
                          ${
                            isActive
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0 flex-wrap lg:flex-nowrap">
                {activeTab === "agent-prompt" && (
                  <button
                    onClick={() => setPromptOpen(true)}
                    className="px-4 py-2 text-sm rounded-lg bg-linear-to-b from-[#9450FF] to-[#435CFE] text-white cursor-pointer"
                  >
                    ✨ Add Prompt
                  </button>
                )}
                <button className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white">
                  📞 Call Me
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
        </div>
      </div>

      {/* ================= PROMPT DRAWER ================= */}
      {isPromptOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-1999"
            onClick={() => setPromptOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-105 bg-white shadow-2xl z-2000 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 ">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 text-sm">
                  ✨
                </span>
                <h2 className="text-base font-medium text-neutral-700">
                  Add Prompt
                </h2>
              </div>

              <button
                onClick={() => setPromptOpen(false)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
              {/* Tabs */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium cursor-pointer bg-blue-50 text-blue-600 border-blue-200">
                  📄 New Prompt
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-xs text-gray-500 cursor-pointer hover:bg-gray-50">
                  ✏️ Edit Prompt
                </button>
              </div>

              {/* Prompt box */}
              <div className="border rounded-xl p-4 flex flex-col gap-3">
                <p className="text-sm text-[#909090] mb-6">
                  Hello! I’m your AI voice assistant. How can I help you today?
                  <br />
                  You can ask me to explain something, guide you through a task,
                  answer questions.
                </p>

                {/* Input row */}
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg border border-gray-400  hover:border-gray-500 cursor-pointer">
                    <img src="/assets/svgs/recordings.svg" />
                  </button>

                  <button className="p-2 rounded-lg border bg-[#2F6AFF1A] text-white hover:border-[#2F6AFF] cursor-pointer">
                    <img src="/assets/svgs/send.svg" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 flex gap-3 ">
              <button className="bg-blue-600 text-white rounded-lg py-2 px-6 text-sm font-medium hover:bg-blue-700 cursor-pointer">
                Insert
              </button>
              <button
                onClick={() => setPromptOpen(false)}
                className="bg-gray-100 text-gray-600 rounded-lg py-2 px-6 text-sm hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= LEFT FORM ================= */

function LeftForm({ form, setForm }: LeftFormProps) {
  const router = useRouter();
  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 mb-6 cursor-pointer"
      >
        <ArrowBack fontSize="small" />
        Back
      </button>

      <div className="space-y-4">
        <Field label="Name">
          <TextField
            fullWidth
            size="small"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        <Field label="Description">
          <TextField
            fullWidth
            size="small"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>

        <Field label="Opening Line">
          <TextField
            fullWidth
            size="small"
            value={form.openingLine}
            onChange={(e) => setForm({ ...form, openingLine: e.target.value })}
          />
        </Field>

        <Field label="Language">
          <FormControl fullWidth size="small">
            <Select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            >
              <MenuItem value="English">English</MenuItem>
            </Select>
          </FormControl>
        </Field>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, textTransform: "capitalize" }}
        >
          Publish
        </Button>
      </div>
    </>
  );
}

const Field = ({ label, children }: FieldProps) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    {children}
  </div>
);
