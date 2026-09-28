import prisma from "../../../utils/prisma";
import { geminiService } from "../gemini.service";

export const classifyIncomingEmail = async (subject: string, message: string) => {
  const prompt = `You are an AI Email Assistant. Categorize the following incoming message.
Subject: "${subject}"
Message: "${message}"

Respond with ONLY ONE of the following exactly: JOB, FREELANCE, COLLABORATION, GENERAL, SPAM`;
  
  const responseStr = await geminiService.generateCachedResponse("You are an AI Email Assistant.", prompt, "gemini-1.5-flash", 60);
  return responseStr.trim().toUpperCase();
};

export const generateEmailDraft = async (messageContext: string, intent: string) => {
  const prompt = `You are a professional AI Assistant for a Senior Software Engineer. 
Draft a response to this message based on the intent: ${intent}.
Message Context: "${messageContext}"`;
  
  return geminiService.generateCachedResponse("You are a professional AI Assistant.", prompt, "gemini-1.5-flash", 60);
};
