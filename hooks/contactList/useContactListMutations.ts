import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse } from "../auth/useAuthMutations";
import { AxiosError, AxiosResponse } from "axios";
import { contactListService } from "@/services/contactList.service";
import {
  Contact,
  ContactList,
  UpdateContactListPayload,
  UpdateContactPayload,
} from "@/types/contact-list.types";

export type CreateContactListResponse = {
  status_code: number;
  message: string;
  data: {
    contactList: ContactList;
  };
};

export type CreateContactResponse = {
  status_code: number;
  message: string;
  data: {
    contacts: ContactList;
  };
};
export interface DeleteContactListResponse {
  status_code: number;
  message: string;
}
export interface DeleteContactResponse {
  status_code: number;
  message: string;
}

export const useCreateContactList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactListService.createContactList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contact_lists"],
      });
    },
  });
};

// export const useUpdateContactList = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     AxiosResponse<CreateContactListResponse>,
//     AxiosError<ApiErrorResponse>,
//     { contactListId: string; payload: UpdateContactListPayload }
//   >({
//     mutationFn: ({ contactListId, payload }) =>
//       contactListService.updateContactList({ contactListId, payload }),

//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["contact_lists"],
//         exact: false,
//       });

//       // optional: invalidate single contact list cache
//       queryClient.invalidateQueries({
//         queryKey: ["contact_lists", variables.contactListId],
//       });
//     },
//   });
// };

export const useUpdateContactList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contactListId,
      payload,
    }: {
      contactListId: string;
      payload: UpdateContactListPayload;
    }) => contactListService.updateContactList({ contactListId, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contact-lists"],
      });

      queryClient.invalidateQueries({
        queryKey: ["contacts"],
      });
    },
  });
};

export const useDeleteContactList = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<DeleteContactListResponse>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: (id: string) => contactListService.deleteContactList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_lists"] });
    },
  });
};

// ================ CONTACTS =================
export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactListService.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
      });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CreateContactResponse>,
    AxiosError<ApiErrorResponse>,
    { contactId: string; payload: UpdateContactPayload }
  >({
    mutationFn: ({ contactId, payload }) =>
      contactListService.updateContact({ contactId, payload }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
        exact: false,
      });

      // optional: invalidate single contact cache
      queryClient.invalidateQueries({
        queryKey: ["contacts", variables.contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contact-lists"],
      });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<DeleteContactResponse>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: (id: string) => contactListService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useBulkDeleteContacts = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<DeleteContactResponse>,
    AxiosError<ApiErrorResponse>,
    { ids: string[] }
  >({
    mutationFn: ({ ids }) => contactListService.deleteBulkContacts({ ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useBulkUpdateContacts = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CreateContactResponse>,
    AxiosError<ApiErrorResponse>,
    Contact[]
  >({
    mutationFn: (contacts) => contactListService.updateBulkContacts(contacts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
