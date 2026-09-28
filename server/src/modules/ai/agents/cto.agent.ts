import { searchSimilarDocuments } from "../vector.service";
import { geminiService } from "../gemini.service";

export const aiCtoAdvisor = async (query: string) => {
  // Search KnowledgeBase for System Design context
  const docs: any = await searchSimilarDocuments(query, 3);
  const context = docs.map((d: any) => d.content).join("\n\n");
  
  const systemPrompt = `You are a Principal Cloud Architect and CTO Advisor.
Use the provided system architecture context to give authoritative recommendations, trade-offs, and scalability advice.

Architecture Context:
${context}`;

  return geminiService.generateCachedResponse(systemPrompt, query, "gemini-1.5-flash", 3600);
};
