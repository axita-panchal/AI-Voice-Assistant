"use client";

import { useState } from "react";

type ActionKey = "calendar" | "transfer" | "custom" | "webhook";

type ActionState = {
  [key in ActionKey]?: string;
};

export default function AgentAction() {
  const [openAction, setOpenAction] = useState<ActionKey | null>(null);

  const [values, setValues] = useState<ActionState>({
    calendar: "",
    transfer: "",
    custom: "",
    webhook: "",
  });

  const toggle = (key: ActionKey) => {
    setOpenAction((prev) => (prev === key ? null : key));
  };

  const updateValue = (key: ActionKey, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <ActionRow
        title="Calendar Booking"
        description="Connect calendars here so your Agent can schedule meetings."
        isOpen={openAction === "calendar"}
        onAdd={() => toggle("calendar")}
      >
        <CommonInput
          placeholder="Enter calendar URL"
          value={values.calendar || ""}
          onChange={(v) => updateValue("calendar", v)}
        />
      </ActionRow>

      <ActionRow
        title="Call Transfer"
        description="Add transfer numbers here so your Agent can forward calls."
        isOpen={openAction === "transfer"}
        onAdd={() => toggle("transfer")}
      >
        <CommonInput
          placeholder="Enter phone number"
          value={values.transfer || ""}
          onChange={(v) => updateValue("transfer", v)}
        />
      </ActionRow>

      <ActionRow
        title="Custom Actions"
        description="Add flows or automations your Agent can trigger mid-call."
        isOpen={openAction === "custom"}
        onAdd={() => toggle("custom")}
      >
        <CommonInput
          placeholder="Enter action name"
          value={values.custom || ""}
          onChange={(v) => updateValue("custom", v)}
        />
      </ActionRow>

      <ActionRow
        title="Post-Call Webhook"
        description="Add the URL where you want the end of call report to be sent."
        isOpen={openAction === "webhook"}
        onAdd={() => toggle("webhook")}
      >
        <CommonInput
          placeholder="Enter webhook URL"
          value={values.webhook || ""}
          onChange={(v) => updateValue("webhook", v)}
          actionLabel="Test webhook"
        />
      </ActionRow>
    </div>
  );
}

/* ---------------- Reusable Row ---------------- */

function ActionRow({
  title,
  description,
  children,
  isOpen,
  onAdd,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg bg-[#F5F8FF]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 sm:p-7">
        <div className="w-full sm:max-w-[75%]">
          <h3 className="text-sm sm:text-base font-medium text-gray-600">
            {title}
          </h3>
          <p className="text-sm sm:text-[15px] text-gray-500 mt-1">
            {description}
          </p>
        </div>

        <button
          onClick={onAdd}
          className={`flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded-lg shrink-0 transition cursor-pointer w-fit
            ${
              isOpen
                ? "bg-gray-200 text-gray-700"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          <span className="text-base leading-none">{isOpen ? "−" : "+"}</span>
          {isOpen ? "Close" : "Add"}
        </button>
      </div>

      {isOpen && <div className="px-4 sm:px-7 pb-4 sm:pb-6">{children}</div>}
    </div>
  );
}

/* ---------------- Common Input ---------------- */

function CommonInput({
  value,
  onChange,
  placeholder,
  actionLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />

      {actionLabel && (
        <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
