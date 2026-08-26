"use client";

import { Button } from "@mui/material";
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
  const hasPrompt = !!prompt?.trim();
  const sections = parsePromptSections(prompt);

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
            No prompt available
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
      {/* RENDERED PROMPT SECTIONS */}
      <div className="space-y-4">
        {sections.map((sec, idx) => (
          <PromptCard key={idx} title={sec.title} text={sec.text} />
        ))}
      </div>
    </div>
  );
}
