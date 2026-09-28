import { ChatOpenAI } from "@langchain/openai";

export const generateProjectBlueprint = async (idea: string) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o" });
  
  const prompt = `You are a Principal Software Engineer. Create a highly detailed technical blueprint for the following project idea: "${idea}"

Respond strictly with a JSON object (no markdown) containing:
{
  "scope": "Detailed project scope string",
  "architecture": "Architecture pattern description",
  "databaseDesign": "Database schema description",
  "apiDesign": "API layer description",
  "techStack": ["string", "array", "of", "technologies"],
  "roadmap": ["string", "array", "of", "milestones"]
}`;

  const response = await llm.invoke([{ role: "user", content: prompt }]);
  
  try {
    const raw = response.content as string;
    return JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch (error) {
    console.error("Failed to parse project blueprint", error);
    return null;
  }
};
