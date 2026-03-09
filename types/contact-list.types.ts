export interface ContactList {
  id: string;
  name: string;
  campaign_id: string;
  subaccount_id: string;
  contacts: ContactList[];
}

export interface CreateContactListPayload {
  name: string;
}

export interface GetContactListsParams {
  limit?: number;
  skip?: number;
}

export interface UpdateContactListPayload {
  name?: string;
  campaign_id?: string | null;
  add_contact_ids?: string[];
  remove_contact_ids?: string[];
}

export type CreateContactPayload = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  contact_list_id?: string;
};

export type UpdateContactPayload = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  contact_list_id?: string | null;
};

// export interface Contact {
//   id: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   lastOutcome: string | null;
//   lastDial: string | null;
//   listId: string;
//   contact_list_id?: string | null;
//   status: string;
//   email: string;
//   dnc: boolean;
//   name?: string;
//   actions?: string;
// }
// export interface Contact {
//   id: string;
//   first_name: string;
//   last_name: string;
//   phone: string;
//   lastOutcome?: string | null;
//   last_dial_time?: string | null;
//   listId: string;
//   contact_list_id?: string | null;
//   status: string;
//   email: string;
//   dnc: boolean;
//   name?: string;
//   actions?: string;
// }
export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  status: string;
  dnc: boolean;
  lastOutcome: string | null | undefined;
  last_dial_time: string | null | undefined;
  listId: string;
  contact_list_id?: string | null;
  // add these optional fields
  business_name?: string;
  job_title?: string;
  full_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  timezone?: string;
  custom_fields?: unknown[];
  actions?: string;
}

export interface BulkDncUpdate {
  id: string;
  dnc: boolean;
}
export interface ApiContact {
  id: string;
  contact_list_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string | null;
  business_name?: string | null;
  full_address?: string | null;
  city?: string | null;
  country?: string | null;
  state?: string | null;
  postal_code?: string | null;
  phone: string;
  job_title?: string | null;
  dnc: boolean;
  source?: string;
  timezone?: string | null;
  custom_fields?: unknown[];
  subaccount_id?: string;
  last_dial_time?: string | undefined | null;
  most_recent_outcome?: string | null;
  status: string;
  lastOutcome?: string | undefined | null;
  actions?: string;
}

export interface deleteContactList {
  id: string;
  name: string;
  count: number;
}

export type BulkActionType = "delete" | "enableDNC" | "disableDNC" | null;
