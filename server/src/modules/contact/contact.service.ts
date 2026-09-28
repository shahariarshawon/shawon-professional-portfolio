import prisma from "../../utils/prisma";
import { sendContactConfirmation, sendOwnerNotification } from "../../utils/email.service";
import { classifyContactMessage } from "../ai/chat.service";

type TCreateContactMessagePayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string;
  company?: string;
  source?: string;
};

const createContactMessage = async (payload: TCreateContactMessagePayload) => {
  const { website, subject, ...messageData } = payload;

  // Honeypot spam protection
  if (website && website.trim().length > 0) {
    return null;
  }

  const classification = await classifyContactMessage(messageData.message);

  const result = await prisma.contactMessage.create({
    data: {
      name: messageData.name,
      email: messageData.email,
      subject: subject?.trim() || "Portfolio Contact Message",
      message: messageData.message,
      status: "NEW",
      category: classification.category,
      priority: classification.priority,
      aiSummary: classification.summary,
      company: payload.company,
      source: payload.source
    } as any
  });

  // Send automated emails in the background
  Promise.all([
    sendContactConfirmation(messageData.email, messageData.name),
    sendOwnerNotification({ ...messageData, company: payload.company, source: payload.source })
  ]).catch(err => console.error("Email automation failed:", err));

  return result;
};

export const ContactService = {
  createContactMessage
};