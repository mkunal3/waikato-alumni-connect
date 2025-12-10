import bcrypt from "bcryptjs";
import { Router, Request, Response } from "express";

import prisma from "../prisma";

const router = Router();

// We keep this as a TS-only type for safety.
// Prisma still sees `role` as plain String.
type UserRole = "student" | "alumni" | "admin";

// POST /auth/register
router.post(
  "/register",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { name, email, password, role } = req.body as {
        name?: string;
        email?: string;
        password?: string;
        role?: UserRole;
      };

      // 1. Basic validation
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          error: "Name, email, password, and role are required",
        });
      }

      const normalisedEmail = email.toLowerCase().trim();

      const allowedRoles: UserRole[] = ["student", "alumni", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid user role" });
      }

      // 2. Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalisedEmail },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // 3. Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // 4. Create user in database
      const newUser = await prisma.user.create({
        data: {
          name,
          email: normalisedEmail,
          passwordHash,
          role,                     // String in Prisma
          approvalStatus: "pending" // matches schema comment + default
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          createdAt: true,
        },
      });

      // 5. Respond
      return res.status(201).json({
        message: "User registered successfully",
        user: newUser,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;