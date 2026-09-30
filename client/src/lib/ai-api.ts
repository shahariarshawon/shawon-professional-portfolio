import { api } from "@/lib/api";
import { TApiResponse } from "@/types/api";

export const askPortfolioAssistant = async (
  query: string,
  sessionId: string
): Promise<string> => {
  const res = await api.post<TApiResponse<{ response: string }>>("/ai/ask", {
    query,
    sessionId
  });
  return res.data.data?.response ?? "No response received.";
};
