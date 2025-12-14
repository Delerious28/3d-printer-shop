import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    : undefined
});

export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP not configured, skipping email", { to, subject });
    return;
  }
  await transport.sendMail({
    from: process.env.MAIL_FROM || "Remoof <no-reply@remoof.nl>",
    to,
    subject,
    html
  });
}
