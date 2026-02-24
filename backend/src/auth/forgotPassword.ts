import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import prisma from "../prisma";

const router = Router();

function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isSmtpConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  );
}

async function sendResetEmail(to: string, code: string): Promise<void> {
  const smtpConfigured = isSmtpConfigured();

  const transporter = smtpConfigured
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    : nodemailer.createTransport({ jsonTransport: true });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@waikato-connect.ac.nz",
    to,
    subject: "Waikato Connect - Password Reset Code",
    text: `Use this code to reset your password: ${code}. This code expires in 15 minutes.`,
    html: `<p>Use this code to reset your password:</p><h2>${code}</h2><p>This code expires in 15 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

router.post(
  "/forgot-password",
  async (req: Request, res: Response): Promise<Response | void> => {
    const { email } = req.body as { email?: string };

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const normalisedEmail = email.toLowerCase().trim();
    const genericResponse = {
      message: "If the email exists, a reset code has been sent.",
    };

    try {
      const user = await prisma.user.findUnique({
        where: { email: normalisedEmail },
        select: { id: true, email: true },
      });

      if (user) {
        const code = generateResetCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.emailVerification.upsert({
          where: {
            email_purpose: {
              email: normalisedEmail,
              purpose: "PASSWORD_RESET",
            },
          },
          update: {
            code,
            expiresAt,
            usedAt: null,
          },
          create: {
            email: normalisedEmail,
            code,
            purpose: "PASSWORD_RESET",
            expiresAt,
            usedAt: null,
          },
        });

        try {
          await sendResetEmail(normalisedEmail, code);
        } catch (emailError) {
          console.error("Failed to send reset email; code stored", emailError);
        }

        if (process.env.NODE_ENV !== "production") {
          return res.json({ ...genericResponse, code });
        }
      }

      return res.json(genericResponse);
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.json(genericResponse);
    }
  }
);

export default router;
