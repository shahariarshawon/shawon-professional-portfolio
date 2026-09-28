import { api } from "@/lib/api";
import { TApiResponse } from "@/types/api";
import { TContactPayload, TContactResponse } from "@/types/contact";

export const sendContactMessage = async (payload: TContactPayload) => {
  const res = await api.post<TApiResponse<TContactResponse>>(
    "/contact",
    payload
  );

  return res.data;
};