import { OpenAIEmbeddings } from "@langchain/openai";

export const getEmbeddingsModel = () => {
  return new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "text-embedding-3-small",
  });
};
