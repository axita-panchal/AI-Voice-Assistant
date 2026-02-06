"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import GenericTable, { Column } from "@/components/common/DynamicTable";
import IconButton from "@/components/common/IconButton";
import CampaignDrawer from "@/components/campaign/CampaignDrawer";

type Campaign = {
  id: number;
  name: string;
  description: string;
  phone: string;
  actions?: string;
};

const campaigns: Campaign[] = [
  {
    id: 1,
    name: "Alexa Peterson",
    description: "Customer Support Agent",
    phone: "20",
  },
  {
    id: 2,
    name: "John Doe",
    description: "Sales Agent",
    phone: "15",
  },
];

export default function CampaignPage() {
  const [open, setOpen] = useState(false);

  const columns: Column<Campaign>[] = [
    { key: "name", label: "Campaign" },
    { key: "description", label: "Agent" },
    { key: "phone", label: "Daily Cap" },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <IconButton danger>
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <div className="p-6 bg-[#F6F8FB]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-700">
              List of Campaigns
            </h2>

            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <AddIcon sx={{ fontSize: 16 }} />
              New Campaign
            </button>
          </div>

          <div className="mt-6">
            <GenericTable columns={columns} data={campaigns} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE DRAWER */}
      <CampaignDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
