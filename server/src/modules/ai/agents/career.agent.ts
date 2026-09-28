import { geminiService } from "../gemini.service";

export const evaluatePortfolioScore = async (portfolioData: any) => {
  const prompt = `You are an elite Software Engineering Manager evaluating a candidate's portfolio.
Data:
${JSON.stringify(portfolioData)}

Evaluate this portfolio and generate a JSON response (no markdown) with:
- technicalDepthScore (0-100)
- backendExpertiseScore (0-100)
- aiSkillsScore (0-100)
- cloudSkillsScore (0-100)
- communicationScore (0-100)
- overallScore (0-100)
- improvementSuggestions (array of strings)
`;
  
  const responseStr = await geminiService.generateCachedResponse("You are an evaluator.", prompt, "gemini-1.5-flash", 86400);
  
  try {
    return JSON.parse(responseStr.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch (error) {
    console.error("Failed to parse portfolio score", error);
    return null;
  }
};
