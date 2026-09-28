import { searchSimilarDocuments } from "./vector.service";
import prisma from "../../utils/prisma";
import { geminiService } from "./gemini.service";

export const askAssistant = async (sessionId: string, query: string) => {
  try {
    const docs: any = await searchSimilarDocuments(query, 5);
    const context = docs.map((d: any) => d.content).join("\n\n");
    
    const systemPrompt = `You are Shahariar's AI Portfolio Assistant. Answer the user's questions strictly using the provided context. If the answer is not in the context, politely say you don't know and invite them to contact Shahariar directly.\n\nContext:\n${context}`;
    
    const answer = await geminiService.generateCachedResponse(
      systemPrompt, 
      query, 
      "gemini-1.5-flash", 
      3600
    );
    
    await prisma.aIConversation.create({
      data: {
        sessionId,
        query,
        response: answer
      }
    });
    
    return answer;
  } catch (error) {
    console.error("AI Error:", error);
    return "I am currently unavailable due to maintenance. Please try again later or contact Shahariar directly.";
  }
};

export const generateBlogSummary = async (content: string) => {
  return geminiService.generateCachedResponse(
    "Summarize this blog post for a short description (max 2 sentences).",
    content,
    "gemini-1.5-flash",
    86400
  );
};

export const suggestSEOTitle = async (content: string) => {
  return geminiService.generateCachedResponse(
    "Suggest a highly engaging SEO title for this blog post (just the title, no quotes).",
    content,
    "gemini-1.5-flash",
    86400
  );
};

export const classifyContactMessage = async (message: string) => {
  try {
    const prompt = `Analyze this contact form message sent to a developer portfolio. 
Return exactly a valid JSON object (no markdown, no backticks, no quotes) with these keys:
- category: one of "JOB", "FREELANCE", "COLLABORATION", "GENERAL"
- priority: one of "HIGH", "MEDIUM", "LOW"
- summary: a short 1-sentence summary of the visitor's intent (e.g. "This visitor is a recruiter looking for backend developers.")`;

    const response = await geminiService.generateCachedResponse(prompt, message, "gemini-1.5-flash", 60);
    const cleanStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanStr) as { category: string, priority: string, summary: string };
  } catch (error) {
    console.error("Classification error:", error);
    return { category: "GENERAL", priority: "LOW", summary: "Automated parsing failed." };
  }
};

export const generateContentIdeas = async (topic: string) => {
  return geminiService.generateCachedResponse(
    "Generate 5 technical content ideas (blogs, linkedin posts) based on the topic. Return as a bulleted list.",
    topic,
    "gemini-1.5-flash",
    3600
  );
};

export const generateProjectDocumentation = async (projectData: any) => {
  const prompt = `Act as a Senior Software Architect. Generate professional README documentation and an architecture breakdown for the following project.
Format with markdown. Include:
- Architecture (Frontend, API Layer, Backend Services, Database, AI Layer if applicable)
- Challenges
- Solution
- Impact`;
  
  return geminiService.generateCachedResponse(
    prompt,
    JSON.stringify(projectData, null, 2),
    "gemini-1.5-flash",
    86400
  );
};
