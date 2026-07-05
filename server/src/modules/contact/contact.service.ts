import prisma from "../../utils/prisma";

type TCreateContactMessagePayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string;
};

const createContactMessage = async (payload: TCreateContactMessagePayload) => {
  const { website, subject, ...messageData } = payload;

  if (website && website.trim().length > 0) {
    return null;
  }

  const result = await prisma.contactMessage.create({
    data: {
      name: messageData.name,
      email: messageData.email,
      subject: subject || null,
      message: messageData.message,
      status: "UNREAD"
    }
  });

  return result;
};

export const ContactService = {
  createContactMessage
};