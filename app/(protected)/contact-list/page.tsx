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
  TextField,
  Typography,
} from "@mui/material";
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

  const { control, handleSubmit, reset } = useForm<ContactFilterValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      outcome: "all",
    },
  });

  const apiLists: ContactList[] = data?.data?.data?.contact_lists || [];
  const apiContacts: ApiContact[] = contactData?.data?.data?.contacts || [];

  const [activeListId, setActiveListId] = useState<string>("all");
  const [deleteListId, setDeleteListId] = useState<deleteContactList | null>(
    null,
  );
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [selectedRows, setSelectedRows] = useState<Contact[]>([]);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
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

  const lists = useMemo(() => {
    return apiLists.map((list) => ({
      id: list.id,
      name: list.name,
    }));
  }, [apiLists]);

  const mappedContacts: Contact[] = useMemo(() => {
    return apiContacts.map((contact: ApiContact) => ({
      id: contact.id,
      firstName: contact.first_name,
      lastName: contact.last_name,
      phone: contact.phone,
      email: contact.email,
      lastOutcome: contact.most_recent_outcome,
      lastDial: contact.last_dial_time,
      listId: contact.contact_list_id,
      status: contact.status,
      dnc: contact.dnc,
    }));
  }, [apiContacts]);

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

  const handleCreateContactList = async () => {
    if (!newListName.trim()) return;
    try {
      await createContactList({ name: newListName });
      toast.success("Contact list created successfully");
    } catch (error: unknown) {
      let message = "Invalid credentials";
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          message;
      }
      toast.error(message);
    }
    setNewListName("");
    setIsListModalOpen(false);
  };

  const handleDeleteList = async () => {
    if (!deleteListId) return;
    try {
      await deleteContactList(deleteListId?.id);
      toast.success("Contact list deleted successfully");
      if (activeListId === deleteListId.id) {
        setActiveListId("all");
      }
    } catch (error: unknown) {
      let message = "Invalid credentials";
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
      let message = "Invalid credentials";
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
      let message = "Invalid credentials";
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

  const handleEditContact = async (id: string, data: Contact) => {
    try {
      const updatedcontactRes = await updateContact({
        contactId: id,
        payload: data,
      });
      if (
        data?.contact_list_id &&
        updatedcontactRes?.data?.status_code === 200
      ) {
        await queryClient.invalidateQueries({
          queryKey: ["contact-lists"],
        });
        // when ever this condition get true at time call contact-list get api
      }
      setSelectedContact(null);
      setEditOpen(false);
    } catch (error) {}
  };

  const onApplyFilters = (values: ContactFilterValues) => {
    handleCloseFilter();
  };

  const handleOpenSelectMenu = (event: React.MouseEvent<HTMLElement>) => {
    setSelectAnchorEl(event.currentTarget);
  };

  const handleOpenFilter = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const columns: Column<Contact>[] = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <Box className="flex items-center gap-3">
          <Avatar />
          <Typography fontSize={14} noWrap>
            {row.firstName} {row.lastName}
          </Typography>
        </Box>
      ),
    },
    { key: "phone", label: "Phone" },
    { key: "lastOutcome", label: "Last Outcome" },
    { key: "lastDial", label: "Last Dial" },
    {
      key: "dnc",
      label: "Do not call",
      className: "min-w-[100px]",
      render: (row) => (
        <Switch
          checked={!!row.dnc}
          onClick={(e) => {
            e.stopPropagation();
            handleEditContact(row?.id, { ...row, dnc: !row?.dnc });
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
          ...contact,
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
          ...contact,
          dnc: false,
        }));

        // const disabledDNCRes = await
        const disabledDNCRes = await updateBulkConats(payload);
        if (disabledDNCRes?.data?.status_code === 200) {
          toast?.success(
            disabledDNCRes?.data?.message || "Bulk edit successfully done",
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
    <div className="p-4 sm:p-6 bg-[#F6F8FB]">
      <Box className="p-6 rounded-2xl bg-white border border-gray-200">
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
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isActive ? "#2F6AFF99" : "#E5E7EB",
                  backgroundColor: isActive ? "#2f6aff1a" : "#00000008",
                  color: isActive ? "#2F6AFF" : "#808080",
                  "&:hover": {
                    backgroundColor: isActive ? "#2f6aff26" : "#00000012",
                  },
                }}
              >
                {list.name}
                <Chip size="small" label={list.count} sx={{ flexShrink: 0 }} />
                {!isAll && (
                  <>
                    <IconButton
                      sx={{
                        flexShrink: 0,
                        "&:hover": {
                          backgroundColor: "#fee2e2",
                          color: "#dc2626",
                        },
                        fontSize: 16,
                        padding: 0,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteListId(list);
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditContactList(list.id);
                      }}
                      sx={{ fontSize: 16, padding: 0 }}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </>
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
        <Box className="mt-4 flex justify-between items-center">
          <Stack direction="row" alignItems="center" gap={1}>
            <Image
              src="/assets/svgs/contacts.svg"
              width={24}
              height={24}
              alt="Contact"
            />
            <Typography fontWeight={600} fontSize={18}>
              All Contacts
            </Typography>
          </Stack>
          <Box className="flex flex-wrap items-center gap-2">
            {selectedRows?.length > 0 && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleOpenSelectMenu}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    fontSize: 13,
                    textTransform: "none",
                    borderColor: "#E5E7EB",
                    color: "#333",
                    mr: 1,
                    mb: { xs: 1, sm: 0 },
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
                  variant="contained"
                  onClick={handleConfirmBulkAction}
                  disabled={!selectedBulkAction}
                  sx={{
                    backgroundColor: "#2F6AFF",
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Confirm
                </Button>
              </>
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
              sx={{ fontSize: 13, textTransform: "none", color: "#909090" }}
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
              sx={{ fontSize: 13, textTransform: "none", color: "#2F6AFF" }}
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
              }}
            >
              Add Contact
            </Button>
          </Box>
        </Box>
        {/* TABLE */}
        <Box mt={4}>
          {/* <GenericTable
            columns={columns}
            data={filteredContacts}
            selectedIds={selectedIds}
            onRowClick={(row) => handleOpenEdit(row)}
            showCheckBoxes
            // onSelectionChange={(ids) => setSelectedIds(ids.map(String))}
            onSelectionChange={(row) => setSelectedIds(row)}
          /> */}
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
          onClose={() => setIsListModalOpen(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Add Contact List</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="List name"
              margin="normal"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsListModalOpen(false)}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateContactList}
              sx={{
                textTransform: "capitalize",
                backgroundColor: "#1976d2",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  opacity: 1,
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
        </Dialog>
        {/* DELETE DIALOG */}
        <Dialog
          open={!!deleteListId}
          onClose={() => setDeleteListId(null)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              p: 1,
            },
          }}
        >
          <DialogTitle>Delete {deleteListId?.name || ""}?</DialogTitle>
          <DialogContent>
            Are you sure you want to remove this contact list? This action
            cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteListId(null)}
              sx={{ textTransform: "none", border: "1px solid #1976d2" }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteList}
              disabled={isDeletingContactList}
              sx={{
                textTransform: "none",
                "&.Mui-disabled": {
                  backgroundColor: "lab(48.4493% 77.4328 61.5452)",
                  color: "#fff",
                  opacity: 1,
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
          onSubmit={handleEditContact}
          isUpdatingContact={isUpdatingContact}
        />
        <ContactFilterPopover
          open={isFilterOpen}
          anchorEl={filterAnchorEl}
          onClose={handleCloseFilter}
          control={control}
          onClear={handleClearFilters}
          onApply={handleSubmit(onApplyFilters)}
        />
        <EditContactListDrawer
          open={editContactListOpen}
          onClose={() => {
            setEditContactListOpen(false);
            setSelectedContactList(null);
          }}
          contactList={contactListDetail?.data?.data?.contact_list}
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
                {contactToDelete?.firstName} {contactToDelete?.lastName}
              </p>
              <p className="text-sm text-gray-500">{contactToDelete?.email}</p>
            </div>
          )}
        </ConfirmModal>
      </Box>
    </div>
  );
}
