import { searchSimilarDocuments } from "../vector.service";
import { geminiService } from "../gemini.service";

export type AgentRole = "RECRUITER" | "CONTENT" | "CODE_REVIEW" | "CAREER" | "ROUTER";

export const agentRouter = async (query: string): Promise<AgentRole> => {
  const prompt = `Analyze this query and route it to the correct AI Agent.
Query: "${query}"

Roles:
- RECRUITER: Hiring questions, candidate summaries, project recommendations.
- CONTENT: Personal branding, linkedin posts, blog generation.
- CODE_REVIEW: Analyzing github repos, code quality, architecture patterns.
- CAREER: Skills to learn, portfolio improvements, market trends.

Respond with exactly ONE word matching the role. If unsure, respond RECRUITER.`;

  const response = await geminiService.generateCachedResponse("You are an AI router.", prompt, "gemini-1.5-flash", 60);
  const role = response.trim().toUpperCase();
  
  if (["RECRUITER", "CONTENT", "CODE_REVIEW", "CAREER"].includes(role)) {
    return role as AgentRole;
  }
  return "RECRUITER";
};

export const executeAgent = async (sessionId: string, query: string) => {
  const role = await agentRouter(query);
  
  // In a full implementation, each role would have its own Agent class 
  // with specialized LangChain Tools (e.g. GitHub API Tool for CODE_REVIEW).
  const docs: any = await searchSimilarDocuments(query, 5);
  const context = docs.map((d: any) => d.content).join("\n\n");
  
  let systemPrompt = "";

  switch (role) {
    case "RECRUITER":
      systemPrompt = `You are an AI Recruiter Agent. Use the context to explain Shahariar's experience and why he is a great fit. Context: ${context}`;
      break;
    case "CONTENT":
      systemPrompt = `You are an AI Content Agent. Generate highly engaging LinkedIn posts or blogs based on the context. Context: ${context}`;
      break;
    case "CODE_REVIEW":
      systemPrompt = `You are an AI Code Review Agent. Provide engineering insights and architecture feedback based on the context. Context: ${context}`;
      break;
    case "CAREER":
      systemPrompt = `You are an AI Career Agent. Suggest skills to learn and portfolio improvements. Context: ${context}`;
      break;
  }

  const response = await geminiService.generateCachedResponse(systemPrompt, query, "gemini-1.5-flash", 3600);
  
  return {
    role,
    response
  };
};
