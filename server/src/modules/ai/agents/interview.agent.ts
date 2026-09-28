import { geminiService } from "../gemini.service";

export const generateInterviewQuestions = async (topic: string) => {
  const prompt = `You are a Senior Technical Recruiter. Generate 3 difficult interview questions about ${topic}. Format as a JSON array of strings without markdown blocks.`;
  const responseStr = await geminiService.generateCachedResponse("You are a Senior Technical Recruiter.", prompt, "gemini-1.5-flash", 3600);
  
  try {
    return JSON.parse(responseStr.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch (error) {
    console.error("Failed to parse interview questions", error);
    return [];
  }
};

export const evaluateInterviewAnswer = async (question: string, answer: string) => {
  const prompt = `You are evaluating a candidate's answer to the following technical interview question:
Question: "${question}"
Candidate Answer: "${answer}"

Evaluate the answer. Provide a JSON response (no markdown) with:
- score: (0 to 100)
- feedback: (Detailed improvement suggestions)
- strengths: (What they did right)
`;
  const responseStr = await geminiService.generateCachedResponse("You are an evaluator.", prompt, "gemini-1.5-flash", 3600);
  
  try {
    return JSON.parse(responseStr.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch (error) {
    console.error("Failed to evaluate answer", error);
    return null;
  }
};
