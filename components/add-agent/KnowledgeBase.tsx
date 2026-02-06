"use client";

import { useState } from "react";

export default function KnowledgeBase() {
  const [isManageOpen, setIsManageOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* TOP CARD */}
      <div className="flex items-center justify-between p-6 bg-[#F5F8FF] rounded-xl">
        <div>
          <h3 className="text-sm font-medium text-gray-700">
            Manage Knowledge
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Add knowledge that your assistant can use during phone calls.
          </p>
        </div>

        <button
          onClick={() => setIsManageOpen(true)}
          className="px-4 py-2 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          Manage
        </button>
      </div>

      {/* EXPANDED CARD */}
      {isManageOpen && (
        <div className="bg-gray-100 rounded-xl p-6 space-y-4 relative">
          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-100 rotate-45" />

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <button
                onClick={() => setIsManageOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
              Manage Knowledge
            </div>

            <div className="flex gap-2">
              <ActionButton label="Add File" icon="/assets/svgs/folder.svg" />
              <ActionButton label="Add URL" icon="/assets/svgs/link.svg" />
              <ActionButton
                label="Add Text"
                icon="/assets/svgs/text_line.svg"
              />
            </div>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}

/* ---------------- Small Button ---------------- */

function ActionButton({ label, icon }: { label: string; icon: string }) {
  return (
    <button className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center gap-1">
        <img src={icon} alt={label} className="w-4 h-4" />
        {label}
      </div>
    </button>
  );
}
