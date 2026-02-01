import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma";

const router = Router();

const ADMIN_EMAIL = "admin@test.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Admin User";

async function ensureAdmin(_req: Request, res: Response): Promise<Response | void> {
    try {
      const existing = await prisma.user.findFirst({
        where: { email: ADMIN_EMAIL },
      });

      if (existing) {
        return res.status(200).json({
          message: "Admin already exists",
          email: ADMIN_EMAIL,
        });
      }

      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          name: ADMIN_NAME,
          passwordHash,
          role: "admin",
          approvalStatus: "approved",
          mentoringGoals: [],
          skillsOffered: [],
          skillsWanted: [],
          interests: [],
          languages: [],
          mentoringTypes: [],
        },
      });

      return res.status(201).json({
        message: "Admin created",
        email: ADMIN_EMAIL,
      });
    } catch (error) {
      console.error("Setup admin error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * One-time setup: create initial admin user (admin@test.com / admin123).
 * Idempotent: if admin already exists, returns success without changes.
 * Use after fresh deployment when no admin can be registered via UI.
 */
router.post("/setup-admin", ensureAdmin);
router.get("/setup-admin", ensureAdmin);

export default router;
