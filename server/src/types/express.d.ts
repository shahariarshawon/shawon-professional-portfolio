import { TAdminRole } from "./auth";

declare global {
  namespace Express {
    interface Request {
      admin?: {
        adminId: string;
        email: string;
        role: TAdminRole;
      };
    }
  }
}

export {};