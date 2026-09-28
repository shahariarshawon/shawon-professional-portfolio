import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not configured. Skipping email send.");
      return;
    }
    
    await transporter.sendMail({
      from: `"Shahariar Portfolio" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendContactConfirmation = async (email: string, name: string) => {
  const subject = "Thanks for reaching out!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hello ${name},</h2>
      <p>Thank you for reaching out to me through my portfolio website.</p>
      <p>I have received your message and will get back to you as soon as possible, usually within 24-48 hours.</p>
      <br />
      <p>Best regards,</p>
      <p><strong>Al Shahariar Arafat Shawon</strong></p>
    </div>
  `;
  await sendEmail(email, subject, html);
};

export const sendOwnerNotification = async (payload: any) => {
  const subject = `New Contact Message from ${payload.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Company:</strong> ${payload.company || "N/A"}</p>
      <p><strong>Source:</strong> ${payload.source || "N/A"}</p>
      <br />
      <p><strong>Message:</strong></p>
      <p style="padding: 12px; background: #f5f5f5; border-radius: 4px;">${payload.message}</p>
    </div>
  `;
  await sendEmail(process.env.OWNER_EMAIL || process.env.SMTP_USER || "", subject, html);
};
