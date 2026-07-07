import {
  BulkDncUpdate,
  CreateContactListPayload,
  CreateContactPayload,
  GetContactListsParams,
  UpdateContactListPayload,
  UpdateContactPayload,
} from "@/types/contact-list.types";
import http from "./http";

export const contactListService = {
  // ================ CONTACT LISTS =================
  createContactList: async (payload: CreateContactListPayload) => {
    const res = await http.post("/contact-list", payload);
    return res?.data;
  },
  getContactLists: async ({ limit, skip }: GetContactListsParams) => {
    const res = await http.get(`/contact-list/`, {
      params: { limit, skip },
    });
    return res?.data || [];
  },
  getContactListById: async ({ contactListId }: { contactListId: string }) => {
    const res = await http.get(`/contact-list/${contactListId}`);
    return res?.data;
  },
  updateContactList: async ({
    contactListId,
    payload,
  }: {
    contactListId: string;
    payload: UpdateContactListPayload;
  }) => {
    const res = await http.patch(`/contact-list/${contactListId}`, payload);
    return res?.data;
  },
  deleteContactList: async (contactListId: string) => {
    const res = await http.delete(`/contact-list/${contactListId}`);
    return res;
  },

  // ================ CONTACTS =================
  createContact: async (payload: CreateContactPayload) => {
    const res = await http.post("/contact", payload);
    return res?.data;
  },
  getContacts: async ({ limit, skip }: { limit?: number; skip?: number }) => {
    const res = await http.get(`/contact/`, {
      params: { limit, skip },
    });
    return res?.data || [];
  },
  getContactById: async ({ contactId }: { contactId: string }) => {
    const res = await http.get(`/contact/${contactId}`);
    return res?.data;
  },
  updateContact: async ({
    contactId,
    payload,
  }: {
    contactId: string;
    payload: UpdateContactPayload;
  }) => {
    const res = await http.patch(`/contact/${contactId}`, payload);
    return res;
  },
  deleteContact: async (contactId: string) => {
    const res = await http.delete(`/contact/${contactId}`);
    return res;
  },
  deleteBulkContacts: async (payload: { ids: string[] }) => {
    const res = await http.post(`/contact/bulk-delete`, payload);
    return res;
  },
  updateBulkContacts: async (payload: BulkDncUpdate[]) => {
    const res = await http.patch("contact/bulk-update", { items: payload });
    return res;
  },
};
