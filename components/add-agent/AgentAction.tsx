"use client";

import { useState, useEffect } from "react";
import { useForm, type Path } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { AgentCalendar } from "@/types/agent.types";
import AddCalendarModal from "./AddCalendarModal";
import PhoneInputField from "@/components/common/PhoneInputField";
import {
  useAddCalendar,
  useUpdateCalendar,
  useDeleteCalendar,
} from "@/hooks/agent/useAgentMutations";
import { IconButton, Dialog, DialogContent, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const transferSchema = z.object({
  transfer_phone_number: z
    .string()
    .optional()
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Enter a valid phone number",
    }),
});

type TransferFormValues = z.infer<typeof transferSchema>;

type ActionKey = "transfer" | "custom" | "webhook";

type ActionState = {
  [key in ActionKey]?: string;
};

type Props = {
  agentId?: string;
  calendars?: AgentCalendar[];
  onAddCalendar?: (calendar: AgentCalendar) => Promise<void>;
  isAddingCalendar?: boolean;
  onCalendarUpdate?: (calendars: AgentCalendar[]) => void;
  onCalendarDelete?: (calendars: AgentCalendar[]) => void;
  transferPhoneNumber?: string;
  onSaveTransferPhoneNumber?: (phoneNumber: string) => Promise<void>;
  onDeleteTransferPhoneNumber?: () => Promise<void>;
  isUpdatingTransfer?: boolean;
};

export default function AgentAction({
  agentId,
  calendars = [],
  onAddCalendar,
  isAddingCalendar = false,
  onCalendarUpdate,
  onCalendarDelete,
  transferPhoneNumber = "",
  onSaveTransferPhoneNumber,
  onDeleteTransferPhoneNumber,
  isUpdatingTransfer = false,
}: Props) {
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<AgentCalendar | null>(
    null,
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [calendarToDelete, setCalendarToDelete] = useState<string | null>(null);
  const [transferEditMode, setTransferEditMode] = useState(false);
  const [deleteTransferConfirmOpen, setDeleteTransferConfirmOpen] =
    useState(false);
  const [openAction, setOpenAction] = useState<ActionKey | null>(null);

  const {
    control: transferControl,
    handleSubmit: handleTransferSubmit,
    reset: resetTransferForm,
    formState: { errors: transferErrors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      transfer_phone_number: transferPhoneNumber,
    },
  });

  useEffect(() => {
    resetTransferForm({
      transfer_phone_number: transferPhoneNumber,
    });
  }, [transferPhoneNumber, resetTransferForm]);

  const [values, setValues] = useState<ActionState>({
    transfer: "",
    custom: "",
    webhook: "",
  });

  const addCalendarMutation = useAddCalendar();
  const updateCalendarMutation = useUpdateCalendar();
  const deleteCalendarMutation = useDeleteCalendar();

  const toggle = (key: ActionKey) => {
    setOpenAction((prev) => (prev === key ? null : key));
  };

  const updateValue = (key: ActionKey, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddCalendar = async (calendar: AgentCalendar) => {
    if (!onAddCalendar && !agentId) return;

    try {
      if (editingCalendar && agentId) {
        // Update existing calendar
        await updateCalendarMutation.mutateAsync({
          agentId,
          uniqueId: editingCalendar.unique_id,
          calendar: {
            unique_id: calendar.unique_id,
            description: calendar.description,
          },
        });
        // Update parent state with edited calendar
        if (onCalendarUpdate) {
          const updatedCalendars = calendars.map((cal) =>
            cal.unique_id === editingCalendar.unique_id ? calendar : cal,
          );
          onCalendarUpdate(updatedCalendars);
        }
      } else if (onAddCalendar) {
        // Add new calendar through prop callback
        await onAddCalendar(calendar);
      } else if (agentId) {
        // Add new calendar directly
        await addCalendarMutation.mutateAsync({
          agentId,
          calendar,
        });
        if (onCalendarUpdate) {
          onCalendarUpdate([...calendars, calendar]);
        }
      }
      setCalendarModalOpen(false);
      setEditingCalendar(null);
    } catch {
      // Keep modal open so the user can retry or fix input.
    }
  };

  const handleEditCalendar = (calendar: AgentCalendar) => {
    setEditingCalendar(calendar);
    setCalendarModalOpen(true);
  };

  const handleDeleteClick = (uniqueId: string) => {
    setCalendarToDelete(uniqueId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!agentId || !calendarToDelete) return;

    try {
      await deleteCalendarMutation.mutateAsync({
        agentId,
        uniqueId: calendarToDelete,
      });
      // Update parent state after successful delete
      if (onCalendarDelete) {
        const updatedCalendars = calendars.filter(
          (cal) => cal.unique_id !== calendarToDelete,
        );
        onCalendarDelete(updatedCalendars);
      }
      setDeleteConfirmOpen(false);
      setCalendarToDelete(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleSaveTransferPhoneNumber = handleTransferSubmit(
    async (data: TransferFormValues) => {
      if (!onSaveTransferPhoneNumber || !data.transfer_phone_number?.trim())
        return;

      try {
        await onSaveTransferPhoneNumber(data.transfer_phone_number.trim());
        setTransferEditMode(false);
      } catch {
        // Error handled by parent
      }
    },
  );

  const handleDeleteTransferPhoneNumber = async () => {
    if (!onDeleteTransferPhoneNumber) return;

    try {
      await onDeleteTransferPhoneNumber();
      resetTransferForm({ transfer_phone_number: "" });
      setDeleteTransferConfirmOpen(false);
    } catch {
      // Error handled by parent
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <CalendarActionRow
        calendars={calendars}
        onAdd={() => setCalendarModalOpen(true)}
        onEdit={handleEditCalendar}
        onDelete={handleDeleteClick}
        isDeleting={deleteCalendarMutation.isPending}
      />

      <AddCalendarModal
        open={calendarModalOpen}
        onClose={() => {
          setCalendarModalOpen(false);
          setEditingCalendar(null);
        }}
        onSubmit={handleAddCalendar}
        existingCalendars={calendars}
        isSubmitting={
          isAddingCalendar ||
          addCalendarMutation.isPending ||
          updateCalendarMutation.isPending
        }
        editingCalendar={editingCalendar}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: {
                xs: "92%",
                sm: "540px",
              },
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0px 16px 40px rgba(0,0,0,0.10)",
              margin: 0,
              backgroundColor: "#fff",
            },
          },
        }}
      >
        <DialogContent className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-[#464646]">
              Delete Calendar
            </h2>
            <p className="text-base text-gray-500 mt-2">
              Are you sure you want to delete this calendar? This action cannot
              be undone.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outlined"
              className="capitalize!"
              sx={{ fontSize: "14px", borderRadius: "10px" }}
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deleteCalendarMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="capitalize!"
              sx={{
                fontSize: "14px",
                borderRadius: "10px",
                backgroundColor: "#dc2626",
                "&:hover": {
                  backgroundColor: "#b91c1c",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  opacity: 0.7,
                },
              }}
              onClick={handleConfirmDelete}
              disabled={deleteCalendarMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Transfer Phone Confirmation Dialog */}
      <Dialog
        open={deleteTransferConfirmOpen}
        onClose={() => setDeleteTransferConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: {
                xs: "92%",
                sm: "540px",
              },
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0px 16px 40px rgba(0,0,0,0.10)",
              margin: 0,
              backgroundColor: "#fff",
            },
          },
        }}
      >
        <DialogContent className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-[#464646]">
              Delete Transfer Phone Number
            </h2>
            <p className="text-base text-gray-500 mt-2">
              Are you sure you want to delete this transfer phone number? This
              action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outlined"
              className="capitalize!"
              sx={{ fontSize: "14px", borderRadius: "10px" }}
              onClick={() => setDeleteTransferConfirmOpen(false)}
              disabled={isUpdatingTransfer}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="capitalize!"
              sx={{
                fontSize: "14px",
                borderRadius: "10px",
                backgroundColor: "#dc2626",
                "&:hover": {
                  backgroundColor: "#b91c1c",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  opacity: 0.7,
                },
              }}
              onClick={handleDeleteTransferPhoneNumber}
              disabled={isUpdatingTransfer}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Phone Number Row - Inline Editable */}
      <div className="border border-gray-200 rounded-lg bg-[#F5F8FF]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 sm:p-7">
          <div className="w-full sm:max-w-[75%]">
            <h3 className="text-sm sm:text-base font-medium text-gray-600">
              Transfer Phone Number
            </h3>
            <p className="text-sm sm:text-[15px] text-gray-500 mt-1">
              Add a phone number where your Agent can forward calls.
            </p>
          </div>

          {!transferPhoneNumber && !transferEditMode && (
            <button
              onClick={() => setTransferEditMode(true)}
              className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded-lg shrink-0 transition cursor-pointer w-fit bg-[#2F6AFF] hover:bg-blue-700 text-white disabled:opacity-50"
              disabled={isUpdatingTransfer}
            >
              <span className="text-base leading-none">+</span>
              Add
            </button>
          )}
        </div>

        {transferEditMode && (
          <div className="px-4 sm:px-7 pb-4 sm:pb-6">
            <form
              onSubmit={handleSaveTransferPhoneNumber}
              className="space-y-3"
            >
              <PhoneInputField<TransferFormValues>
                name="transfer_phone_number"
                control={transferControl}
                error={transferErrors.transfer_phone_number?.message}
              />

              <div className="flex gap-2 flex-col sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setTransferEditMode(false);
                    resetTransferForm({
                      transfer_phone_number: transferPhoneNumber,
                    });
                  }}
                  disabled={isUpdatingTransfer}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingTransfer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingTransfer ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}

        {transferPhoneNumber && !transferEditMode && (
          <div className="px-4 sm:px-7 pb-4 sm:pb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {transferPhoneNumber}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <IconButton
                    size="small"
                    onClick={() => setTransferEditMode(true)}
                    disabled={isUpdatingTransfer}
                    className="text-blue-600 hover:bg-blue-50"
                    title="Edit transfer phone number"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setDeleteTransferConfirmOpen(true)}
                    disabled={isUpdatingTransfer}
                    className="text-red-600 hover:bg-red-50"
                    title="Delete transfer phone number"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

/* ---------------- Calendar Row ---------------- */

function CalendarActionRow({
  calendars,
  onAdd,
  onEdit,
  onDelete,
  isDeleting,
}: {
  calendars: AgentCalendar[];
  onAdd: () => void;
  onEdit: (calendar: AgentCalendar) => void;
  onDelete: (uniqueId: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-lg bg-[#F5F8FF]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 sm:p-7">
        <div className="w-full sm:max-w-[75%]">
          <h3 className="text-sm sm:text-base font-medium text-gray-600">
            Calendar Booking
          </h3>
          <p className="text-sm sm:text-[15px] text-gray-500 mt-1">
            Connect calendars here so your Agent can schedule meetings.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded-lg shrink-0 transition cursor-pointer w-fit bg-[#2F6AFF] hover:bg-blue-700 text-white"
        >
          <span className="text-base leading-none">+</span>
          Add
        </button>
      </div>

      {calendars.length > 0 && (
        <div className="px-4 sm:px-7 pb-4 sm:pb-6 space-y-3">
          {calendars.map((calendar) => (
            <div
              key={calendar.unique_id}
              className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">
                      {calendar.platform}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      ID: {calendar.unique_id}
                    </span>
                  </div>
                  {calendar.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {calendar.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(calendar)}
                    className="text-blue-600 hover:bg-blue-50"
                    title="Edit calendar"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(calendar.unique_id)}
                    disabled={isDeleting}
                    className="text-red-600 hover:bg-red-50"
                    title="Delete calendar"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
                : "bg-[#2F6AFF] hover:bg-blue-700 text-white"
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
