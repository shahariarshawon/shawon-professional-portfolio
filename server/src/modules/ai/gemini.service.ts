import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { env } from "../../config/env";
import { redisService } from "../../common/redis/redis.service";
import crypto from "crypto";

class GeminiService {
  public getModel(modelName: string = "gemini-1.5-flash"): ChatGoogleGenerativeAI {
    if (!env.geminiApiKey) {
      throw new Error("Gemini API key is not configured.");
    }
    return new ChatGoogleGenerativeAI({
      apiKey: env.geminiApiKey,
      model: modelName,
      maxOutputTokens: 2048,
    });
  }

  public getEmbeddingsModel(): GoogleGenerativeAIEmbeddings {
    if (!env.geminiApiKey) {
      throw new Error("Gemini API key is not configured.");
    }
    return new GoogleGenerativeAIEmbeddings({
      apiKey: env.geminiApiKey,
      model: "text-embedding-004", // Standard Gemini embedding model
    });
  }

  /**
   * Generates a cached AI response if available.
   * If not, invokes the LLM and caches the output.
   */
  public async generateCachedResponse(
    systemPrompt: string,
    userQuery: string,
    modelName: string = "gemini-1.5-flash",
    ttl: number = 3600
  ): Promise<string> {
    const cacheKey = `ai:cache:${crypto.createHash("md5").update(systemPrompt + userQuery).digest("hex")}`;
    
    try {
      const cachedResponse = await redisService.get(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    } catch (e) {
      console.warn("Redis caching bypassed due to connection issues.");
    }

    try {
      const llm = this.getModel(modelName);
      const response = await llm.invoke([
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery }
      ]);
      
      const content = response.content as string;

      try {
        await redisService.set(cacheKey, content, ttl);
      } catch (e) {
        console.warn("Failed to set cache in Redis.");
      }

      return content;
    } catch (error) {
      console.error("Gemini API generation failed:", error);
      return "If I don't have enough information, I should say so. (System failure: Gemini API unavailable)";
    }
  }
}

export const geminiService = new GeminiService();
