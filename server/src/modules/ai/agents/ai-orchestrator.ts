import { agentRouter } from "./agent-router";
import { aiCtoAdvisor } from "./cto.agent";
import { generateProjectBlueprint } from "./project.agent";
import { evaluatePortfolioScore } from "./career.agent";

export const executeCentralOrchestrator = async (query: string, intentOverride?: string) => {
  console.log(`[AI-Orchestrator] Intercepting Query: ${query}`);
  
  const role = intentOverride || await agentRouter(query);
  console.log(`[AI-Orchestrator] Target Sub-Agent: ${role}`);

  try {
    switch (role) {
      case "CODE_REVIEW":
        return { source: "CTO_AGENT", response: await aiCtoAdvisor(query) };
      case "CONTENT":
        return { source: "PROJECT_AGENT", response: await generateProjectBlueprint(query) };
      case "CAREER":
        return { source: "CAREER_AGENT", response: await evaluatePortfolioScore({ query }) };
      default:
        return { source: "DEFAULT_ROUTER", response: "Delegating to standard RAG chat." };
    }
  } catch (error) {
    console.error(`[AI-Orchestrator] Fault detected:`, error);
    return { source: "ORCHESTRATOR", response: "A system failure occurred while processing this request." };
  }
};
