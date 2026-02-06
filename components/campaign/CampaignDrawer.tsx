"use client";

import {
  Checkbox,
  Drawer,
  IconButton as MuiIconButton,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import clsx from "clsx";
import { formatTime } from "@/utils/helper";

export default function CampaignDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [hours, setHours] = useState<number[]>([9, 20]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "w-[420px] rounded-l-2xl",
      }}
    >
      <div className="h-full flex flex-col p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 justify-center  ">
            <img src={"/assets/svgs/campaign.svg"} alt="campaign" />
            <span className="text-base text-gray-500">Add Campaign</span>
          </div>
          <MuiIconButton onClick={onClose}>
            <CloseIcon />
          </MuiIconButton>
        </div>

        {/* FORM */}
        <div className="flex-1 space-y-5 overflow-y-auto text-base font-medium text-gray-700 p-2">
          <Input label="Name" placeholder="John" />
          <Select label="Agent" />
          <Input label="Daily Usage Cap (minutes)" placeholder="20" />
          <Select label="Contact list" />
          <Input label="Maximum Follow Ups" placeholder="0 - 15" />

          {/* CALLING DAYS */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Calling days
            </p>

            <div className="flex gap-3 flex-wrap">
              {DAYS.map((day) => {
                const checked = selectedDays.includes(day);

                return (
                  <div
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={clsx(
                      "w-12 h-14  flex flex-col items-center justify-center cursor-pointer transition",
                      checked
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400",
                    )}
                  >
                    <Checkbox checked={checked} size="small" className="p-0!" />
                    <span className="text-sm text-gray-600 mt-0.5">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIME SLIDER */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Local calling hours
            </p>

            <Slider
              value={hours}
              min={0}
              max={24}
              step={1}
              onChange={(_, value) => setHours(value as number[])}
              valueLabelDisplay="off"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(hours[0])}</span>
              <span>{formatTime(hours[1])}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm">
            Finish
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </Drawer>
  );
}

/* ---------------- SMALL REUSABLE INPUTS ---------------- */

function Input({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        placeholder={placeholder}
        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({ label }: { label: string }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
        <option>Choose an option...</option>
      </select>
    </div>
  );
}
