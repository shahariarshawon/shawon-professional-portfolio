export type TAdminRole = "SUPER_ADMIN" | "ADMIN";

export type TAdmin = {
  id: string;
  name: string;
  email: string;
  role: TAdminRole;
  isActive?: boolean;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  admin: TAdmin;
};