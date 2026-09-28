import { ChatOpenAI } from "@langchain/openai";
import { searchSimilarDocuments } from "./vector.service";
import prisma from "../../utils/prisma";

export const askAssistant = async (sessionId: string, query: string) => {
  try {
    const docs: any = await searchSimilarDocuments(query, 5);
    const context = docs.map((d: any) => d.content).join("\n\n");
    
    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-mini",
      temperature: 0.2
    });
    
    const systemPrompt = `You are Shahariar's AI Portfolio Assistant. Answer the user's questions strictly using the provided context. If the answer is not in the context, politely say you don't know and invite them to contact Shahariar directly.\n\nContext:\n${context}`;
    
    const response = await llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: query }
    ]);
    
    const answer = response.content as string;
    
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
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o-mini" });
  const response = await llm.invoke([{ role: "user", content: `Summarize this blog post for a short description (max 2 sentences):\n\n${content}` }]);
  return response.content;
};

export const suggestSEOTitle = async (content: string) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o-mini" });
  const response = await llm.invoke([{ role: "user", content: `Suggest a highly engaging SEO title for this blog post (just the title, no quotes):\n\n${content}` }]);
  return response.content as string;
};

export const classifyContactMessage = async (message: string) => {
  try {
    const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o-mini", temperature: 0.1 });
    const prompt = `Analyze this contact form message sent to a developer portfolio. 
Return exactly a valid JSON object (no markdown, no backticks, no quotes) with these keys:
- category: one of "JOB", "FREELANCE", "COLLABORATION", "GENERAL"
- priority: one of "HIGH", "MEDIUM", "LOW"
- summary: a short 1-sentence summary of the visitor's intent (e.g. "This visitor is a recruiter looking for backend developers.")

Message:
"${message}"`;

    const response = await llm.invoke([{ role: "user", content: prompt }]);
    const cleanStr = (response.content as string).replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanStr) as { category: string, priority: string, summary: string };
  } catch (error) {
    console.error("Classification error:", error);
    return { category: "GENERAL", priority: "LOW", summary: "Automated parsing failed." };
  }
};

export const generateContentIdeas = async (topic: string) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o-mini" });
  const prompt = `Generate 5 technical content ideas (blogs, linkedin posts) based on: "${topic}". Return as a bulleted list.`;
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return response.content as string;
};

export const generateProjectDocumentation = async (projectData: any) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o" });
  const prompt = `Act as a Senior Software Architect. Generate professional README documentation and an architecture breakdown for the following project.
Project Data:
${JSON.stringify(projectData, null, 2)}

Format with markdown. Include:
- Architecture (Frontend, API Layer, Backend Services, Database, AI Layer if applicable)
- Challenges
- Solution
- Impact`;
  
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return response.content as string;
};
