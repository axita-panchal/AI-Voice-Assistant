"use client";

import { ArrowBack } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
  CircularProgress,
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
  agentDataByIdLoading?: boolean;
};
export default function LeftForm({
  form,
  setForm,
  onPublish,
  isUpdating,
  agentDataByIdLoading,
}: Props) {
  const router = useRouter();

  return (
    // <div className="flex flex-col ">
    <form
      className="flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        onPublish();
      }}
      aria-busy={isUpdating}
    >
      {/* <button
        onClick={() => router.push("/agents")}
        className="flex items-center gap-2 text-base text-gray-600 mb-6"
      >
        <ArrowBack fontSize="small" />
        Back
      </button> */}
      <button
        type="button"
        onClick={() => router.push("/agents")}
        className="flex items-center gap-2 text-base text-gray-600 mb-6 cursor-pointer"
        aria-label="Go back to agents page"
      >
        <ArrowBack fontSize="small" aria-hidden="true" />
        <span>Back</span>
      </button>

      <div className="flex-1 overflow-y-auto pb-6 space-y-4 pr-2">
        <Field label="Name" htmlFor="agent-name">
          <TextField
            id="agent-name"
            fullWidth
            size="small"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        <Field label="Description" htmlFor="agent-description">
          <TextField
            id="agent-description"
            fullWidth
            size="small"
            multiline
            minRows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>

        <Field label="Opening Line" htmlFor="agent-openingLine">
          <TextField
            id="agent-openingLine"
            fullWidth
            size="small"
            multiline
            minRows={2}
            value={form.openingLine}
            onChange={(e) => setForm({ ...form, openingLine: e.target.value })}
          />
        </Field>

        <Field label="Language" htmlFor="agent-language">
          <FormControl fullWidth size="small">
            <Select
              id="agent-language"
              value={form.language}
              onChange={(e) =>
                setForm({ ...form, language: e.target.value as string })
              }
            >
              <MenuItem value="English">English</MenuItem>
            </Select>
          </FormControl>
        </Field>
        <Field label="Voice" htmlFor="agent-voice">
          <FormControl fullWidth size="small">
            <Select
              id="agent-voice"
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
          type="submit"
          aria-live="polite"
          // onClick={onPublish}
          disabled={isUpdating || agentDataByIdLoading}
          sx={{
            textTransform: "capitalize",
            backgroundColor: "#1976d2",
            fontSize: 16,
            borderRadius: "16px",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
            "&.Mui-disabled": {
              backgroundColor: "#1976d2",
              color: "#fff",
              opacity: 1,
            },
          }}
        >
          {/* {isUpdating && (
            <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />
          )} */}
          {(isUpdating || agentDataByIdLoading) && (
            <CircularProgress
              size={18}
              sx={{ color: "#fff", mr: 1 }}
              aria-hidden="true"
            />
          )}

          {isUpdating
            ? "Updating..."
            : agentDataByIdLoading
              ? "Data Fetching"
              : "Publish"}
        </Button>
      </div>
      {/* </div> */}
    </form>
  );
}

const Field = ({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <div>
    <label htmlFor={htmlFor} className="text-base text-gray-700 mb-1 block">
      {label}
    </label>
    {children}
  </div>
);
