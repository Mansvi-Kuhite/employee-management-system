import "dotenv/config";
import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (!process.env.SMTP_HOST) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
};

export const sendResetEmail = async (to, name, link, minutes) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`\n[DEV] Password reset link for ${to}:\n${link}\n`);
    return;
  }

  await mailer.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: "Reset your password",
    text:
      `Hi ${name},\n\n` +
      `Use this link to reset your password:\n${link}\n\n` +
      `It expires in ${minutes} minutes. If you didn't ask for this, you can ignore this email.`,
  });
};