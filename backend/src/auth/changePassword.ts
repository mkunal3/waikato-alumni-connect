import bcrypt from "bcryptjs";
import { Router, Response } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/change-password",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const { currentPassword, newPassword } = req.body as {
        currentPassword?: string;
        newPassword?: string;
      };

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current password and new password are required",
        });
      }

      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          passwordHash: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.passwordHash || typeof user.passwordHash !== "string") {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      let passwordValid = false;
      try {
        passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      } catch (compareError) {
        console.error("Password compare error:", compareError);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!passwordValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

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

      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: newPasswordHash,
          passwordUpdatedAt: new Date(),
          mustChangePassword: false,
        },
      });

      return res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
