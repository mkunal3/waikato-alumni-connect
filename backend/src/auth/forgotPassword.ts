import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post(
  "/forgot-password",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email } = req.body as { email?: string };

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const normalisedEmail = email.toLowerCase().trim();

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

        if (process.env.NODE_ENV !== "production") {
          console.log(`\n========================================`);
          console.log(`Password reset code for ${normalisedEmail}: ${code}`);
          console.log(`Expires at: ${expiresAt.toISOString()}`);
          console.log(`========================================\n`);
        }
      }

      return res.json({
        message: "If the email exists, a reset code has been sent.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
