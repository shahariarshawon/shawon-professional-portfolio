export type TAdminRole = "SUPER_ADMIN" | "ADMIN";

export type TAuthTokenPayload = {
  adminId: string;
  email: string;
  role: TAdminRole;
};