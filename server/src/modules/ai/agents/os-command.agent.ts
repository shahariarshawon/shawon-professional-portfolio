import prisma from "../../../utils/prisma";
import { geminiService } from "../gemini.service";

export const osCommandCenter = async (query: string) => {
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
  
  return geminiService.generateCachedResponse(systemContext, query, "gemini-1.5-flash", 60);
};
