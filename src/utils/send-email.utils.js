import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

export const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_EMAIL_PASS,
    },
  });

  await transporter.sendMail({ to, subject, html });
};