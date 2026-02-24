import bcrypt from "bcryptjs";
import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

router.post(
  "/reset-password",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email, code, newPassword } = req.body as {
        email?: string;
        code?: string;
        newPassword?: string;
      };

      if (!email || !code || !newPassword) {
        return res.status(400).json({
          error: "Email, code, and new password are required",
        });
      }

      const normalisedEmail = email.toLowerCase().trim();
      const trimmedCode = code.trim();

      if (newPassword.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }

      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
        newPassword
      );

      if (!hasUppercase || !hasSpecialChar) {
        return res.status(400).json({
          error:
            "Password must contain at least one uppercase letter and one special character",
        });
      }

      const user = await prisma.user.findUnique({
        where: { email: normalisedEmail },
        select: { id: true, email: true },
      });

      if (!user) {
        return res.status(400).json({
          error: "Invalid email or reset code",
        });
      }

      const verification = await prisma.emailVerification.findFirst({
        where: {
          email: normalisedEmail,
          code: trimmedCode,
          purpose: "PASSWORD_RESET",
        },
        orderBy: { createdAt: "desc" },
      });

      if (!verification) {
        return res.status(400).json({
          error: "Invalid email or reset code",
        });
      }

      if (verification.usedAt) {
        return res.status(400).json({
          error: "This reset code has already been used",
        });
      }

      const now = new Date();
      if (verification.expiresAt < now) {
        return res.status(400).json({
          error: "This reset code has expired",
        });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: {
            passwordHash: newPasswordHash,
            passwordUpdatedAt: new Date(),
            mustChangePassword: false,
          },
        }),
        prisma.emailVerification.update({
          where: { id: verification.id },
          data: {
            usedAt: new Date(),
          },
        }),
      ]);

      return res.json({
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
