import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { agentService } from "@/services/agent.service";
import { contactListService } from "@/services/contactList.service";

//* ================= contactlist Queries ================= */
export const useGetContactList = (limit: number, skip: number) => {
  return useQuery({
    queryKey: ["contact_lists", limit, skip],
    queryFn: () =>
      contactListService.getContactLists({
        limit,
        skip,
      }),
    enabled: true,
    staleTime: 0,
  });
};
export const useContactListById = (contactListId?: string) => {
  return useQuery({
    queryKey: ["contact_list", contactListId],
    queryFn: () =>
      contactListService.getContactListById({
        contactListId: contactListId!,
      }),
    enabled: !!contactListId,
    staleTime: 0,
  });
};

//* ================= CONTACTS Queries ================= */
export const useGetContact = (limit: number, skip: number) => {
  return useQuery({
    queryKey: ["contacts", limit, skip],
    queryFn: () =>
      contactListService.getContacts({
        limit,
        skip,
      }),
    enabled: true,
    staleTime: 0,
  });
};
export const useContactById = (contactId?: string) => {
  return useQuery({
    queryKey: ["contacts", contactId],
    queryFn: () =>
      contactListService.getContactById({
        contactId: contactId!,
      }),
    enabled: !!contactId,
    staleTime: 0,
  });
};
