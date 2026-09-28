import { geminiService } from "./gemini.service";

export const getEmbeddingsModel = () => {
  return geminiService.getEmbeddingsModel();
};
