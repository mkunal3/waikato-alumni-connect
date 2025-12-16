import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router, Request, Response } from "express";

import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/login",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email, password } = req.body as {
        email?: string;
        password?: string;
      };

      // 1) Validate input
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // 2) Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res
          .status(401)
          .json({ error: "Invalid email or password" });
      }

      // 3) Compare password
      const passwordValid = await bcrypt.compare(
        password,
        user.passwordHash
      );
      if (!passwordValid) {
        return res
          .status(401)
          .json({ error: "Invalid email or password" });
      }

      // 4) Check approval status (admins bypass approval check)
      if (user.role !== "admin" && user.approvalStatus !== "approved") {
        return res
          .status(403)
          .json({ error: "Your account is not approved yet. Please wait for admin approval." });
      }

      // 5) Generate JWT
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("JWT secret is not configured");
        return res
          .status(500)
          .json({ error: "Authentication service unavailable" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: "1h" }
      );

      // 6) Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = user;

      return res.json({
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET /me - Fetch authenticated user's profile
router.get(
  "/me",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // userId is attached by authenticate middleware
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Fetch user without password hash
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          createdAt: true,
        },
      });

      // User not found
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ user });
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;