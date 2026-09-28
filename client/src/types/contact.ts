export type TContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string;
};

export type TContactResponse = {
  id: string;
  status: "READ" | "UNREAD";
  createdAt: string;
} | null;