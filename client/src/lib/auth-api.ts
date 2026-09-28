import { api } from "@/lib/api";
import { TApiResponse } from "@/types/api";
import { TAdmin, TLoginPayload, TLoginResponse } from "@/types/auth";

export const loginAdmin = async (payload: TLoginPayload) => {
  const res = await api.post<TApiResponse<TLoginResponse>>(
    "/auth/login",
    payload
  );

  return res.data.data;
};

export const getCurrentAdmin = async () => {
  const res = await api.get<TApiResponse<TAdmin>>("/auth/me");
  return res.data.data;
};

export const logoutAdmin = async () => {
  const res = await api.post<TApiResponse<null>>("/auth/logout");
  return res.data;
};