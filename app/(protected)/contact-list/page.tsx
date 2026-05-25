"use client";

import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import CustomTextField from "@/components/common/CustomTextField";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  useBulkDeleteContacts,
  useBulkUpdateContacts,
  useCreateContact,
  useCreateContactList,
  useDeleteContact,
  useDeleteContactList,
  useUpdateContact,
  useUpdateContactList,
} from "@/hooks/contactList/useContactListMutations";
import {
  useContactListById,
  useGetContact,
  useGetContactList,
} from "@/hooks/contactList/useContactListQueries";
import { toast } from "@/utils/toast";
import GenericTable, { Column } from "@/components/common/DynamicTable";
import Image from "next/image";
import AddContactDrawer from "@/components/contact-list/AddContactDrawer";
import {
  ApiContact,
  BulkActionType,
  Contact,
  ContactList,
  CreateContactPayload,
  deleteContactList,
  UpdateContactListPayload,
} from "@/types/contact-list.types";
import EditContactDrawer from "@/components/contact-list/EditContactDrawer";
import ContactFilterPopover, {
  ContactFilterValues,
} from "@/components/contact-list/FilterCotact";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ApiErrorResponse } from "@/hooks/auth/useAuthMutations";
import EditContactListDrawer from "@/components/contact-list/EditContactListDrawer";
import { useQueryClient } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ConfirmModal from "@/components/common/ConfirmModal";
import IconButtonComp from "@/components/common/IconButton";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input";

const listSchema = z.object({
  listName: z
    .string()
    .min(1, "List name is required")
    .trim()
    .min(1, "List name is required"),
});

const contactFilterSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !!val, {
      message: "Phone number is required",
    })
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Enter a valid phone number",
    }),
  outcome: z.enum(["all", "answered", "missed"]).optional(),
});

type ListFormValues = z.infer<typeof listSchema>;

export default function ContactListPage() {
  const queryClient = useQueryClient();

  const [page] = useState(0);
  const limit = 20;
  const skip = page * limit;
  const { data, isLoading } = useGetContactList(limit, skip);
  const { mutateAsync: createContactList, isPending: isCreatingContactList } =
    useCreateContactList();

  const { mutateAsync: deleteContactList, isPending: isDeletingContactList } =
    useDeleteContactList();
  const { mutateAsync: deleteContact, isPending: isDeletingContact } =
    useDeleteContact();
  const { mutateAsync: createContact, isPending: isCreatingContact } =
    useCreateContact();
  const { data: contactData, isLoading: isContactLoading } = useGetContact(
    limit,
    skip,
  );
  const { mutateAsync: bulkDeleteContact } = useBulkDeleteContacts();
  const { mutateAsync: updateContact, isPending: isUpdatingContact } =
    useUpdateContact();
  const { mutateAsync: updateContactList } = useUpdateContactList();

  const { mutateAsync: updateBulkConats } = useBulkUpdateContacts();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: contactFilterErrors },
  } = useForm<ContactFilterValues>({
    resolver: zodResolver(contactFilterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      outcome: "all",
    },
  });

  const apiLists: ContactList[] = data?.data?.contact_lists || [];
  const apiContacts: ApiContact[] = contactData?.data?.contacts || [];

  const [activeListId, setActiveListId] = useState<string>("all");
  const [deleteListId, setDeleteListId] = useState<deleteContactList | null>(
    null,
  );
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [selectedRows, setSelectedRows] = useState<Contact[]>([]);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [createContactDrawerOpen, setCreateContactDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editContactListOpen, setEditContactListOpen] = useState(false);
  const [selectedContactList, setSelectedContactList] =
    useState<ContactList | null>(null);
  const [selectedBulkAction, setSelectedBulkAction] =
    useState<BulkActionType>("delete");
  const [showContactDeleteConfirmModal, setShowContactDeleteConfirmModal] =
    useState(false);

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const isFilterOpen = Boolean(filterAnchorEl);
  const [selectAnchorEl, setSelectAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const isSelectOpen = Boolean(selectAnchorEl);

  const { data: contactListDetail } = useContactListById(
    selectedContactList?.id,
  );

  const {
    register,
    handleSubmit: createContactListHandleSubmit,
    formState: { errors },
    reset: resetCreateContactList,
  } = useForm<ListFormValues>({
    resolver: zodResolver(listSchema),
  });

  const lists = useMemo(() => {
    return apiLists.map((list) => ({
      id: list.id,
      name: list.name,
    }));
  }, [apiLists]);

  const mapApiContactToContact = (contact: ApiContact): Contact => ({
    id: contact.id,
    first_name: contact.first_name,
    last_name: contact.last_name,
    phone: contact.phone,
    email: contact.email,
    lastOutcome: contact.most_recent_outcome,
    last_dial_time: contact.last_dial_time,
    listId: contact.contact_list_id ?? "",
    contact_list_id: contact.contact_list_id,
    status: contact.status,
    dnc: contact.dnc,
    timezone: contact?.timezone ?? "",
    full_address: contact?.full_address ?? "",
    job_title: contact?.job_title ?? "",
    business_name: contact?.business_name ?? "",
    city: contact?.city ?? "",
    state: contact?.state ?? "",
    country: contact?.country ?? "",
    postal_code: contact?.postal_code ?? "",
  });

  const mappedContacts = useMemo(
    () => apiContacts.map(mapApiContactToContact),
    [apiContacts],
  );

  const mapContactToApiPayload = (contact: Contact): Partial<ApiContact> => ({
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email,
    phone: contact.phone,
    status: contact.status,
    dnc: contact.dnc,
    contact_list_id: contact.contact_list_id ?? undefined,
    most_recent_outcome: contact.lastOutcome ?? undefined,
    last_dial_time: contact.last_dial_time ?? undefined,
    business_name: contact.business_name ?? "",
    job_title: contact.job_title ?? "",
    full_address: contact.full_address ?? "",
    city: contact.city ?? "",
    state: contact.state ?? "",
    postal_code: contact.postal_code ?? "",
    country: contact.country ?? "",
    timezone: contact.timezone ?? "",
    custom_fields: contact.custom_fields ?? [],
  });

  const listsWithCounts = useMemo(() => {
    const mapped = apiLists.map((list) => {
      const count = mappedContacts.filter(
        (contact: Contact) => contact.listId === list.id,
      ).length;
      return {
        id: list.id,
        name: list.name,
        count,
      };
    });
    const total = mappedContacts.length;
    return [{ id: "all", name: "All Contacts", count: total }, ...mapped];
  }, [apiLists, mappedContacts]);

  const filteredContacts = useMemo(() => {
    if (activeListId === "all") return mappedContacts;
    return mappedContacts.filter(
      (contact: Contact) => contact.listId === activeListId,
    );
  }, [mappedContacts, activeListId]);

  const handleCreateContactList = async (data: ListFormValues) => {
    try {
      const createdContactListRes = await createContactList({
        name: data?.listName,
      });
      if (createdContactListRes?.data?.status_code === 201) {
        toast.success(
          createdContactListRes?.data?.message ||
            "Contact list created successfully",
        );
        resetCreateContactList();
      }
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          message;
      }
      toast.error(message);
      resetCreateContactList();
    }
    resetCreateContactList();
    setIsListModalOpen(false);
  };

  const handleDeleteList = async () => {
    if (!deleteListId) return;
    try {
      const deleteContactListRes = await deleteContactList(deleteListId?.id);
      toast.success("Contact list deleted successfully");
      if (activeListId === deleteListId.id) {
        setActiveListId("all");
      }
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          message;
      }
      toast.error(message || "Failed to delete contact list");
    }
    setDeleteListId(null);
  };

  const handleCreateContact = async (payload: CreateContactPayload) => {
    try {
      const finalPayload = { ...payload };
      if (!payload.contact_list_id?.trim()) {
        delete finalPayload.contact_list_id;
      } else {
        finalPayload.contact_list_id = payload.contact_list_id.trim();
      }
      const createdContactRes = await createContact(finalPayload);
      if (createdContactRes?.data?.data?.status_code === 201) {
        toast.success(
          createdContactRes?.data?.data?.message ||
            "Contact created successfully",
        );
      }
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const detail = error.response?.data?.detail;
        const fallbackMessage = error.response?.data?.message;
        if (Array.isArray(detail)) {
          if (detail.length > 0 && typeof detail[0] === "object") {
            message = detail.map((item) => item.msg).join(", ");
          } else {
            message = detail.join(", ");
          }
        } else if (typeof detail === "string") {
          message = detail;
        } else if (typeof fallbackMessage === "string") {
          message = fallbackMessage;
        }
      }
      toast.error(message || "Failed to create contact");
    }
    setCreateContactDrawerOpen(false);
  };

  const handleCloseFilter = () => {
    reset();
    setFilterAnchorEl(null);
  };

  const handleDeleteContactList = async () => {
    try {
      if (!contactToDelete) return;
      const deletedContactRes = await deleteContact(contactToDelete?.id || "");
      if (deletedContactRes?.data?.status_code === 200) {
        toast.success(
          deletedContactRes?.data?.message || "Contact deleted successfully",
        );
        setShowContactDeleteConfirmModal(false);
        setContactToDelete(null);
      }
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          message;
      }
      toast.error(message || "Failed to delete contact");
    }
  };

  const handleOpenEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setEditOpen(true);
  };

  const handleClearFilters = () => {
    reset();
  };

  const handleEditContact = async (
    id: string,
    payload: Partial<ApiContact>,
  ) => {
    try {
      const res = await updateContact({
        contactId: id,
        payload,
      });

      if (res?.data?.status_code === 200) {
        toast.success(res?.data?.message || "Contact updated successfully");

        await queryClient.invalidateQueries({
          queryKey: ["contacts"],
        });
        setEditOpen(false);
      }

      setSelectedContact(null);
    } catch (error) {
      toast.error("Failed to update contact");
    }
  };

  const onApplyFilters = (values: ContactFilterValues) => {
    console.log("values: ", values);
    // handleCloseFilter();
  };

  const handleOpenSelectMenu = (event: React.MouseEvent<HTMLElement>) => {
    setSelectAnchorEl(event.currentTarget);
  };

  const handleOpenFilter = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const columns: Column<Contact>[] = [
    {
      key: "first_name",
      label: "Name",
      render: (row) => (
        <Box className="flex items-center gap-3">
          <Avatar />
          <Typography fontSize={14} noWrap>
            {row.first_name} {row.last_name}
          </Typography>
        </Box>
      ),
    },
    { key: "phone", label: "Phone" },
    { key: "lastOutcome", label: "Last Outcome" },
    { key: "last_dial_time", label: "Last Dial" },
    {
      key: "dnc",
      label: "Do not call",
      className: "min-w-[100px]",
      render: (row) => (
        <Switch
          checked={!!row.dnc}
          onClick={(e) => {
            e.stopPropagation();
            handleEditContact(row?.id, { dnc: !row.dnc });
          }}
        />
      ),
    },
    {
      key: "actions",
      label: "Action",
      className: "text-right min-w-[80px]",
      render: (row) => (
        <>
          <IconButtonComp
            onClick={(e) => {
              e.stopPropagation();
              // handleDeleteContactList(row);
              setShowContactDeleteConfirmModal(true);
              setContactToDelete(row);
            }}
            danger
          >
            <DeleteOutline
              fontSize="small"
              sx={{ fontSize: 16, cursor: "pointer" }}
            />
          </IconButtonComp>
        </>
      ),
    },
  ];

  const handleOpenEditContactList = async (id: string) => {
    setSelectedContactList({ id } as ContactList);
    setEditContactListOpen(true);
  };

  const handleEditContactList = async (
    id: string,
    payload: UpdateContactListPayload,
  ) => {
    try {
      await updateContactList({ contactListId: id, payload });
      toast.success("Contact list updated successfully");
      setEditContactListOpen(false);
    } catch (error) {
      toast.error("Failed to update contact list");
    }
  };

  const handleDelete = () => {
    setSelectedBulkAction("delete");
    setSelectAnchorEl(null);
  };

  const handleEnableDNC = () => {
    setSelectedBulkAction("enableDNC");
    setSelectAnchorEl(null);
  };

  const handleDisableDNC = () => {
    setSelectedBulkAction("disableDNC");
    setSelectAnchorEl(null);
  };

  const handleConfirmBulkAction = async () => {
    if (!selectedBulkAction || selectedRows.length === 0) return;

    try {
      if (selectedBulkAction === "delete") {
        const selectedIds = selectedRows?.map((i) => i?.id);
        const bulkDeleteContactRes = await bulkDeleteContact({
          ids: selectedIds,
        });
        if (bulkDeleteContactRes?.data?.status_code === 200) {
          toast.success(
            bulkDeleteContactRes?.data?.message ||
              "Bulk delete successfully done",
          );
        }
      }

      if (selectedBulkAction === "enableDNC") {
        const payload = selectedRows.map((contact) => ({
          id: contact.id,
          dnc: true,
        }));

        // call edit API here
        const enabledDNCRes = await updateBulkConats(payload);
        if (enabledDNCRes?.data?.status_code === 200) {
          toast?.success(
            enabledDNCRes?.data?.message || "Bulk edit successfully done",
          );
          setSelectedRows([]);
        }
      }

      if (selectedBulkAction === "disableDNC") {
        const payload = selectedRows.map((contact) => ({
          id: contact.id,
          dnc: false,
        }));

        // const disabledDNCRes = await
        const disabledDNCRes = await updateBulkConats(payload);
        if (disabledDNCRes?.data?.status_code === 200) {
          toast?.success(
            disabledDNCRes?.data?.message ||
              "Bulk contact edited successfully done",
          );
          setSelectedRows([]);
        }
      }
      setSelectedBulkAction("delete");
    } catch (error) {
      console.error(error);
    }
  };

  const getBulkActionLabel = () => {
    switch (selectedBulkAction) {
      case "delete":
        return "Delete Selected";
      case "enableDNC":
        return 'Enable "Do Not Call"';
      case "disableDNC":
        return 'Disable "Do Not Call"';
      default:
        return "Select";
    }
  };

  return (
    <div className="py-6 px-15 bg-[#F6F8FB] h-full">
      <Box className="bg-white h-full rounded-[20px] border border-[#DDDDDD] p-6">
        <Box
          className="custom-scroll"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflowX: "auto",
            overflowY: "hidden",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
            scrollBehavior: "smooth",
            pb: 1,
          }}
        >
          {listsWithCounts.map((list) => {
            const isActive = activeListId === list.id;
            const isAll = list.id === "all";

            return (
              <Box
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  minWidth: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 2,
                  py: 1,
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isActive ? "#2F6AFF99" : "#E5E7EB",
                  backgroundColor: isActive ? "#2f6aff1a" : "#00000008",
                  color: isActive ? "#2F6AFF" : "#808080",

                  "&:hover .list-content": {
                    opacity: !isAll && 0.25,
                  },

                  "&:hover .action-buttons": {
                    opacity: 1,
                    visibility: "visible",
                  },
                }}
              >
                {/* Main Content */}
                <Box
                  className="list-content"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {list.name}

                  <Chip
                    size="small"
                    label={list.count}
                    sx={{ flexShrink: 0 }}
                  />
                </Box>

                {/* Hover Actions */}
                {!isAll && (
                  <Box
                    className="action-buttons"
                    sx={{
                      position: "absolute",
                      right: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      opacity: 0,
                      visibility: "hidden",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <IconButton
                      sx={{
                        p: 0,
                        "&:hover": {
                          backgroundColor: "#fee2e2",
                          color: "#dc2626",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteListId(list);
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>

                    <IconButton
                      sx={{ p: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditContactList(list.id);
                      }}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            );
          })}

          <IconButton
            onClick={() => setIsListModalOpen(true)}
            sx={{ flexShrink: 0 }}
          >
            <Add />
          </IconButton>
        </Box>

        {/* HEADER */}
        <Box className="mt-4 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-t border-[#DDDDDD]">
          {/* LEFT SECTION */}
          <Stack direction="row" alignItems="center" gap={1}>
            <Image
              src="/assets/svgs/contacts.svg"
              width={24}
              height={24}
              alt="Contact"
            />
            <Typography fontWeight={600} fontSize={{ xs: 16, sm: 18 }}>
              All Contacts
            </Typography>
          </Stack>

          {/* RIGHT SECTION */}
          <Box className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {selectedRows?.length > 0 && (
              <Box className="flex items-center gap-2 w-full sm:w-auto px-6">
                <Button
                  variant="outlined"
                  onClick={handleOpenSelectMenu}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    fontSize: 13,
                    textTransform: "none",
                    borderColor: "#E5E7EB",
                    color: "#333",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  {getBulkActionLabel()} ({selectedRows?.length})
                </Button>
                <Menu
                  anchorEl={selectAnchorEl}
                  open={isSelectOpen}
                  onClose={() => setSelectAnchorEl(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete Selected</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleEnableDNC}>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Enable "Do Not Call"</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleDisableDNC}>
                    <ListItemIcon>
                      <BlockIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Disable "Do Not Call"</ListItemText>
                  </MenuItem>
                </Menu>
                {/* ✅ CONFIRM BUTTON RESTORED */}
                <Button
                  variant="outlined"
                  onClick={handleConfirmBulkAction}
                  disabled={!selectedBulkAction}
                  sx={{
                    textTransform: "none",
                    borderRadius: "12px",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Confirm
                </Button>
              </Box>
            )}

            <Button
              startIcon={
                <Image
                  src="/assets/svgs/filter.svg"
                  alt="Filter"
                  width={18}
                  height={18}
                />
              }
              variant="outlined"
              onClick={handleOpenFilter}
              sx={{
                fontSize: 13,
                textTransform: "none",
                color: "#909090",
                borderRadius: "12px",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Filter
            </Button>
            <Button
              startIcon={
                <Image
                  src="/assets/svgs/export.svg"
                  alt="Export"
                  width={16}
                  height={16}
                />
              }
              variant="outlined"
              sx={{
                fontSize: 13,
                textTransform: "none",
                color: "#2F6AFF",
                borderRadius: "12px",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Upload
            </Button>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => setCreateContactDrawerOpen(true)}
              sx={{
                backgroundColor: "#2F6AFF",
                textTransform: "none",
                borderRadius: "12px",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Add Contact
            </Button>
          </Box>
        </Box>
        {/* TABLE */}
        <Box mt={4}>
          <GenericTable
            columns={columns}
            data={filteredContacts}
            showCheckBoxes
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            onRowClick={(row) => handleOpenEdit(row)}
          />
        </Box>
        {/* CREATE LIST MODAL */}
        <Dialog
          open={isListModalOpen}
          onClose={() => {
            setIsListModalOpen(false);
            resetCreateContactList();
          }}
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
          <DialogTitle>Add Contact List</DialogTitle>
          <form
            onSubmit={createContactListHandleSubmit(handleCreateContactList)}
          >
            <DialogContent sx={{ padding: "10px 24px" }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#474747",
                  mb: 1,
                }}
              >
                List name
              </Typography>

              <CustomTextField
                fullWidth
                placeholder="Enter list name"
                margin="normal"
                {...register("listName")}
                error={!!errors.listName}
                helperText={errors.listName?.message}
                sx={{ marginTop: 0 }}
              />
            </DialogContent>

            <DialogActions sx={{ padding: "16px 24px" }}>
              <Button
                onClick={() => {
                  setIsListModalOpen(false);
                  resetCreateContactList();
                }}
                sx={{
                  width: "120px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#F3F3F3",
                  color: "#6D6D6D",
                  fontSize: "15px",
                  fontWeight: 500,
                  textTransform: "none",

                  "&:hover": {
                    backgroundColor: "#F3F3F3",
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  height: "48px",
                  width: "120px",
                  borderRadius: "12px",
                  backgroundColor: "#2F6AFF",
                  fontSize: "15px",
                  fontWeight: 500,
                  textTransform: "none",

                  "&:hover": {
                    backgroundColor: "#2F6AFF",
                  },

                  "&.Mui-disabled": {
                    backgroundColor: "#3366FF",
                    color: "#fff",
                    opacity: 0.7,
                  },
                }}
                disabled={isCreatingContactList}
                endIcon={
                  isCreatingContactList ? (
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                  ) : null
                }
              >
                Create
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        {/* DELETE DIALOG */}
        <Dialog
          open={!!deleteListId}
          onClose={() => setDeleteListId(null)}
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
          <DialogTitle>
            Delete{" "}
            <span style={{ color: "#2F6AFF", fontWeight: 900 }}>
              {deleteListId?.name || ""}
            </span>
            ?
          </DialogTitle>
          <DialogContent>
            Are you sure you want to remove this contact list? This action
            cannot be undone.
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px" }}>
            <Button
              onClick={() => setDeleteListId(null)}
              sx={{
                width: "120px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#F3F3F3",
                color: "#6D6D6D",
                fontSize: "15px",
                fontWeight: 500,
                textTransform: "none",

                "&:hover": {
                  backgroundColor: "#F3F3F3",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteList}
              disabled={isDeletingContactList}
              sx={{
                height: "48px",
                width: "120px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 500,
                textTransform: "none",

                "&.Mui-disabled": {
                  backgroundColor: "#3366FF",
                  color: "#fff",
                  opacity: 0.7,
                },
              }}
              endIcon={
                isDeletingContactList ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : null
              }
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {/* ADD CONTACT DRAWER */}
        <AddContactDrawer
          open={createContactDrawerOpen}
          onClose={() => setCreateContactDrawerOpen(false)}
          lists={lists}
          onSubmit={handleCreateContact}
          isCreatingContact={isCreatingContact}
        />
        <EditContactDrawer
          open={editOpen}
          onClose={() => setEditOpen(false)}
          contact={selectedContact}
          lists={lists}
          onSubmit={(id, data: Contact) => {
            const payload = mapContactToApiPayload(data);
            handleEditContact(id, payload);
          }}
          isUpdatingContact={isUpdatingContact}
        />
        <ContactFilterPopover
          open={isFilterOpen}
          anchorEl={filterAnchorEl}
          onClose={handleCloseFilter}
          control={control}
          onClear={handleClearFilters}
          contactFilterErrors={contactFilterErrors}
          onApply={handleSubmit(onApplyFilters)}
        />
        <EditContactListDrawer
          open={editContactListOpen}
          onClose={() => {
            setEditContactListOpen(false);
            setSelectedContactList(null);
          }}
          contactList={contactListDetail?.data?.contact_list}
          allContactsData={mappedContacts}
          onSubmit={handleEditContactList}
        />
        <ConfirmModal
          open={showContactDeleteConfirmModal}
          title={`Delete Contact ?`}
          description="Are you sure you want to remove this contact? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
          loading={isDeletingContact}
          onCancel={() => {
            setShowContactDeleteConfirmModal(false);
            setContactToDelete(null);
          }}
          onConfirm={handleDeleteContactList}
        >
          {contactToDelete && (
            <div>
              <p className="font-medium">
                {contactToDelete?.first_name} {contactToDelete?.last_name}
              </p>
              <p className="text-sm text-gray-500">{contactToDelete?.email}</p>
            </div>
          )}
        </ConfirmModal>
      </Box>
    </div>
  );
}
