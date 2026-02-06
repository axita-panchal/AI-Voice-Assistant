export type CreateUserPayload = {
  email: string;
  role: "Agency Owner" | "Workspace Editor" | string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_admin: boolean;
  is_agency_owner: boolean;
};

export type UpdateUserPayload = CreateUserPayload & {
  id: string;
};
