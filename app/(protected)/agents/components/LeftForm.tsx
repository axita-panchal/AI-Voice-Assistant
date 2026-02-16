"use client";

import { ArrowBack } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
} from "@mui/material";
import { useRouter } from "next/navigation";

type AgentForm = {
  name: string;
  description: string;
  openingLine: string;
  language: string;
  voice: string;
};

type Props = {
  form: AgentForm;
  setForm: React.Dispatch<React.SetStateAction<AgentForm>>;
  onPublish: () => void;
  isUpdating?: boolean;
};
export default function LeftForm({
  form,
  setForm,
  onPublish,
  isUpdating,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col ">
      <button
        onClick={() => router.push("/agents")}
        className="flex items-center gap-2 text-base text-gray-600 mb-6"
      >
        <ArrowBack fontSize="small" />
        Back
      </button>

      <div className="flex-1 overflow-y-auto pb-6 space-y-4 pr-2">
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
            multiline
            minRows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>

        <Field label="Opening Line">
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={2}
            value={form.openingLine}
            onChange={(e) => setForm({ ...form, openingLine: e.target.value })}
          />
        </Field>

        <Field label="Language">
          <FormControl fullWidth size="small">
            <Select
              value={form.language}
              onChange={(e) =>
                setForm({ ...form, language: e.target.value as string })
              }
            >
              <MenuItem value="English">English</MenuItem>
            </Select>
          </FormControl>
        </Field>
        <Field label="Voice">
          <FormControl fullWidth size="small">
            <Select
              value={form.voice}
              onChange={(e) =>
                setForm({ ...form, voice: e.target.value as string })
              }
            >
              <MenuItem value="Joseph (English)">Joseph (English)</MenuItem>
            </Select>
          </FormControl>
        </Field>
      </div>

      <div className="shrink-0 pt-4  bg-white ">
        <Button
          fullWidth
          variant="contained"
          sx={{
            textTransform: "capitalize",
            fontSize: 16,
            borderRadius: "16px",
          }}
          onClick={() => onPublish()}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Publish"}
        </Button>
      </div>
    </div>
  );
}
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-base text-gray-00 mb-1">{label}</p>
    {children}
  </div>
);
