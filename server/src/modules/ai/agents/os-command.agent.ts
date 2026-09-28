import { ChatOpenAI } from "@langchain/openai";
import prisma from "../../../utils/prisma";

export const osCommandCenter = async (query: string) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o" });
  
  // In a real OS, we fetch relevant dashboard metrics first
  const brandScores = await prisma.brandHealthScore.findMany({ take: 1, orderBy: { createdAt: 'desc' } });
  const opportunities = await prisma.opportunity.count({ where: { status: "NEW" } });
  
  const systemContext = `
  You are the central AI Operating System for a Senior Developer.
  Current Context:
  - Brand Health: ${brandScores[0]?.overallScore || 'N/A'}/100
  - New Opportunities CRM: ${opportunities}
  
  Answer the admin's query using this internal data:
  Query: "${query}"
  `;
  
  const response = await llm.invoke([{ role: "system", content: systemContext }]);
  return response.content as string;
};
