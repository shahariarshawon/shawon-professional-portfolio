import { geminiService } from "../gemini.service";

export const generateProjectBlueprint = async (idea: string) => {
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

  const responseStr = await geminiService.generateCachedResponse("You are a Principal Software Engineer.", prompt, "gemini-1.5-flash", 3600);
  
  try {
    return JSON.parse(responseStr.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch (error) {
    console.error("Failed to parse project blueprint", error);
    return null;
  }
};
