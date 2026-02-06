"use client";

import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { Column } from "@/components/common/DynamicTable";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@/components/common/IconButton";
import GenericTable from "@/components/common/DynamicTable";
import { useState } from "react";
import AddNewAgentModal from "@/components/add-agent/AddAgentModal";

type Agent = {
  id: number;
  name: string;
  description: string;
  phone: string;
  actions?: string;
};

const agents: Agent[] = [
  {
    id: 1,
    name: "Alexa Peterson",
    description: "Customer Support Agent",
    phone: "013 456 789",
  },
  {
    id: 2,
    name: "John Doe",
    description: "Sales Agent",
    phone: "123 456 789",
  },
];
const AgentPage = () => {
  const [openModal, setOpenModal] = useState(false);

  const columns: Column<Agent>[] = [
    {
      key: "name",
      label: "Agent",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "phone",
      label: "Phone number",
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex gap-2">
          <IconButton>
            <ContentCopyIcon sx={{ fontSize: 16, cursor: "pointer" }} />
          </IconButton>
          <IconButton danger>
            <DeleteOutlineIcon sx={{ fontSize: 16, cursor: "pointer" }} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-[#F6F8FB] ">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <img
              src="/assets/svgs/agent.svg"
              alt="Agent Icon"
              width={24}
              height={24}
              className="align-middle"
            />
            <span className="leading-none text-lg">{"List of agents"}</span>
          </h2>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            <AddIcon sx={{ fontSize: 16 }} />
            New Agent
          </button>
        </div>
        <div className="mt-6">
          {/* <AgentTable /> */}
          <GenericTable columns={columns} data={agents} />
        </div>
      </div>
      <AddNewAgentModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default AgentPage;
