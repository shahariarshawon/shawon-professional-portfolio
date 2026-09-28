import { ChatOpenAI } from "@langchain/openai";
import prisma from "../../../utils/prisma";

export const classifyIncomingEmail = async (subject: string, message: string) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o-mini" });
  const prompt = `You are an AI Email Assistant. Categorize the following incoming message.
Subject: "${subject}"
Message: "${message}"

Respond with ONLY ONE of the following exactly: JOB, FREELANCE, COLLABORATION, GENERAL, SPAM`;
  
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return (response.content as string).trim().toUpperCase();
};

export const generateEmailDraft = async (messageContext: string, intent: string) => {
  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-4o" });
  const prompt = `You are a professional AI Assistant for a Senior Software Engineer. 
Draft a response to this message based on the intent: ${intent}.
Message Context: "${messageContext}"`;
  
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return response.content as string;
};
