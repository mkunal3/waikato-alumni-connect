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
      // IMPORTANT:
      // Use an explicit `select` to avoid Prisma querying columns that may not
      // exist yet in environments where migrations haven't been applied.
      const normalisedEmail = email.toLowerCase().trim();

      const user = await prisma.user.findUnique({
        where: { email: normalisedEmail },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          isActive: true,
          createdAt: true,
          passwordHash: true,
          passwordUpdatedAt: true,
        },
      });
      if (!user) {
        return res
          .status(401)
          .json({ error: "Invalid email or password" });
      }

      // Defensive check: avoid returning 500 if stored hash is missing/invalid
      // Treat as invalid credentials instead.
      if (!user.passwordHash || typeof user.passwordHash !== "string") {
        return res
          .status(401)
          .json({ error: "Invalid email or password" });
      }

      // 3) Compare password
      let passwordValid = false;
      try {
        passwordValid = await bcrypt.compare(password, user.passwordHash);
      } catch (compareError) {
        console.error("Password compare error:", compareError);
        return res
          .status(401)
          .json({ error: "Invalid email or password" });
      }
      if (!passwordValid) {
        return res
          .status(401)
          .json({ error: "Invalid email or password" });
      }

      // 4) Enforce approval gating for students only
      // (Alumni registered via invite code are auto-approved, admins bypass this check)
      if (user.role === "student" && user.approvalStatus !== "approved") {
        if (user.approvalStatus === "pending") {
          return res.status(403).json({
            error: "Your account is pending approval. Please wait for admin approval.",
          });
        } else {
          return res.status(403).json({
            error: "Your account is not approved. Please contact support.",
          });
        }
      }

      // 5) Check if user account is active (applies to all roles including admin)
      if (!user.isActive) {
        return res.status(403).json({
          error: "ACCOUNT_INACTIVE",
          message: "Your account has been deactivated. Please contact support.",
        });
      }

      // 6) Generate JWT
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

      // 7) Remove password hash from response
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
          passwordUpdatedAt: true,
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