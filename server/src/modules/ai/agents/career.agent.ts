import { ChatOpenAI } from "@langchain/openai";

export const evaluatePortfolioScore = async (portfolioData: any) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o" });
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
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  
  try {
    const raw = response.content as string;
    return JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch (error) {
    console.error("Failed to parse portfolio score", error);
    return null;
  }
};
