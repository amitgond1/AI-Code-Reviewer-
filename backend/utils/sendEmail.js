import nodemailer from "nodemailer";

const buildTransport = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = buildTransport();

  if (!transporter) {
    console.log("SMTP is not configured. Email preview:");
    console.log({ to, subject, html });
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || SMTP_USER,
    to,
    subject,
    html
  });
};
