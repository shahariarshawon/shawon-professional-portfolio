import { ChatOpenAI } from "@langchain/openai";
import { searchSimilarDocuments } from "../vector.service";

export const aiCtoAdvisor = async (query: string) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o" });
  
  // Search KnowledgeBase for System Design context
  const docs: any = await searchSimilarDocuments(query, 3);
  const context = docs.map((d: any) => d.content).join("\n\n");
  
  const systemPrompt = `You are a Principal Cloud Architect and CTO Advisor.
Use the provided system architecture context to give authoritative recommendations, trade-offs, and scalability advice.

Architecture Context:
${context}`;

  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: query }
  ]);
  
  return response.content as string;
};
