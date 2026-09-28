import { ChatOpenAI } from "@langchain/openai";

export const generateInterviewQuestions = async (topic: string) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o" });
  const prompt = `You are a Senior Technical Recruiter. Generate 3 difficult interview questions about ${topic}. Format as a JSON array of strings without markdown blocks.`;
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  
  try {
    const raw = response.content as string;
    return JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch (error) {
    console.error("Failed to parse interview questions", error);
    return [];
  }
};

export const evaluateInterviewAnswer = async (question: string, answer: string) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o" });
  const prompt = `You are evaluating a candidate's answer to the following technical interview question:
Question: "${question}"
Candidate Answer: "${answer}"

Evaluate the answer. Provide a JSON response (no markdown) with:
- score: (0 to 100)
- feedback: (Detailed improvement suggestions)
- strengths: (What they did right)
`;
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  
  try {
    const raw = response.content as string;
    return JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch (error) {
    console.error("Failed to evaluate answer", error);
    return null;
  }
};
