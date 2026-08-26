"use client";

import { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

type PromptCardProps = {
  title?: string;
  text: string;
};

const PromptCard = ({ title, text }: PromptCardProps) => (
  <div className="bg-[#F5F8FF] rounded-xl p-5 border border-[#E5EEFF] transition-all hover:border-[#D0E2FF]">
    {title && (
      <p className="text-base font-semibold text-gray-700 mb-2"># {title}</p>
    )}
    <p className="text-[15px] text-gray-600 whitespace-pre-line leading-relaxed">
      {text}
    </p>
  </div>
);

interface ParsedSection {
  title?: string;
  text: string;
}

function parsePromptSections(rawPrompt: string): ParsedSection[] {
  const trimmed = rawPrompt.trim();
  if (!trimmed) return [];

  // Check if contains markdown headers like # Header
  const headerRegex = /^(?:#{1,3})\s+(.+)$/gm;
  const matches = [...trimmed.matchAll(headerRegex)];

  if (matches.length === 0) {
    return [{ text: trimmed }];
  }

  const sections: ParsedSection[] = [];

  // If there is text before the first header
  if (matches[0].index && matches[0].index > 0) {
    const preText = trimmed.substring(0, matches[0].index).trim();
    if (preText) {
      sections.push({ text: preText });
    }
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const title = match[1].trim();
    const startIndex = (match.index ?? 0) + match[0].length;
    const endIndex =
      i + 1 < matches.length
        ? (matches[i + 1].index ?? trimmed.length)
        : trimmed.length;
    const content = trimmed.substring(startIndex, endIndex).trim();

    sections.push({ title, text: content });
  }

  return sections;
}

type Props = {
  prompt?: string;
  onOpenPromptModal?: () => void;
  isLoading?: boolean;
};

export default function AgentPrompt({
  prompt = "",
  onOpenPromptModal,
  isLoading = false,
}: Props) {
  const [copied, setCopied] = useState(false);

  const hasPrompt = !!prompt?.trim();
  const sections = parsePromptSections(prompt);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const characterCount = prompt.length;

  if (isLoading) {
    return (
      <div className="py-8 space-y-4">
        <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-36 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!hasPrompt) {
    return (
      <div className="py-8 flex flex-col items-center justify-center">
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 max-w-lg w-full flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9450FF1A] to-[#435CFE1A] flex items-center justify-center text-2xl mb-4">
            ✨
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No Prompt Configured
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Add system instructions, personality, conversation goals, and
            objection handling for your AI voice agent.
          </p>

          <Button
            variant="contained"
            onClick={onOpenPromptModal}
            startIcon={<AutoAwesomeIcon />}
            sx={{
              textTransform: "none",
              fontSize: "14px",
              borderRadius: "12px",
              px: 3,
              py: 1,
              background: "linear-gradient(to bottom, #9450FF, #435CFE)",
              "&:hover": {
                background: "linear-gradient(to bottom, #8338EC, #3A50E0)",
              },
            }}
          >
            Add Prompt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 space-y-4 min-h-0">
      {/* ACTION & INFO TOOLBAR */}
      <div className="flex items-center justify-between bg-white border border-gray-200/80 rounded-xl px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
            <span>✨</span> System Prompt
          </span>
          <span className="text-xs text-gray-400">
            {wordCount} {wordCount === 1 ? "word" : "words"} &middot;{" "}
            {characterCount} characters
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip title={copied ? "Copied!" : "Copy full prompt"}>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition cursor-pointer"
              aria-label="Copy prompt"
            >
              {copied ? (
                <>
                  <CheckIcon sx={{ fontSize: 15, color: "#16a34a" }} />
                  <span className="text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <ContentCopyIcon sx={{ fontSize: 14 }} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </Tooltip>

          <button
            onClick={onOpenPromptModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#2F6AFF] hover:bg-blue-600 rounded-lg transition cursor-pointer"
            aria-label="Edit prompt"
          >
            <EditIcon sx={{ fontSize: 14 }} />
            <span>Edit Prompt</span>
          </button>
        </div>
      </div>

      {/* RENDERED PROMPT SECTIONS */}
      <div className="space-y-4">
        {sections.map((sec, idx) => (
          <PromptCard key={idx} title={sec.title} text={sec.text} />
        ))}
      </div>
    </div>
  );
}
