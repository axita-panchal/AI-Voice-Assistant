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
  createContactList: (payload: CreateContactListPayload) => {
    return http.post("/contact-list", payload);
  },
  getContactLists: ({ limit, skip }: GetContactListsParams) => {
    return http.get(`/contact-list/`, {
      params: { limit, skip },
    });
  },
  getContactListById: ({ contactListId }: { contactListId: string }) => {
    return http.get(`/contact-list/${contactListId}`);
  },
  updateContactList: ({
    contactListId,
    payload,
  }: {
    contactListId: string;
    payload: UpdateContactListPayload;
  }) => {
    return http.patch(`/contact-list/${contactListId}`, payload);
  },
  deleteContactList: (contactListId: string) => {
    return http.delete(`/contact-list/${contactListId}`);
  },

  // ================ CONTACTS =================
  createContact: (payload: CreateContactPayload) => {
    return http.post("/contact", payload);
  },
  getContacts: ({ limit, skip }: { limit?: number; skip?: number }) => {
    return http.get(`/contact/`, {
      params: { limit, skip },
    });
  },
  getContactById: ({ contactId }: { contactId: string }) => {
    return http.get(`/contact/${contactId}`);
  },
  updateContact: ({
    contactId,
    payload,
  }: {
    contactId: string;
    payload: UpdateContactPayload;
  }) => {
    return http.patch(`/contact/${contactId}`, payload);
  },
  deleteContact: (contactId: string) => {
    return http.delete(`/contact/${contactId}`);
  },
  deleteBulkContacts: (payload: { ids: string[] }) => {
    return http.post(`/contact/bulk-delete`, payload);
  },
  updateBulkContacts: (payload: BulkDncUpdate[]) => {
    return http.patch("contact/bulk-update", { items: payload });
  },
};
