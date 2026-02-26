import bcrypt from "bcryptjs";
import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

/**
 * Helper: Check if email is Waikato staff email
 */
function isWaikatoStaffEmail(email: string): boolean {
  return email.toLowerCase().endsWith("@waikato.ac.nz");
}

function formatNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] || "";
  const words = localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(" ") || "Admin";
}

/**
 * POST /auth/register-admin
 * 
 * Register new admin using valid invitation code.
 * Rules:
 * - Email must end with @waikato.ac.nz (staff only)
 * - Must provide valid invite code (matching email, not expired, not used)
 * - Creates User with role "admin" and approvalStatus "approved"
 * - Marks invitation as used
 * 
 * Body: { name, email, password, inviteCode }
 */
router.post(
  "/register-admin",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { fullName, email, password, inviteCode } = req.body as {
        fullName?: string;
        email?: string;
        password?: string;
        inviteCode?: string;
      };

      // 1. Validate required fields
      if (!email || !password || !inviteCode) {
        return res.status(400).json({
          error: "Email, password, and inviteCode are required",
        });
      }

      const trimmedFullName = (typeof fullName === "string" ? fullName : "").trim();
      if (!trimmedFullName) {
        return res.status(400).json({ error: "Full name is required." });
      }

      // 2. Normalize and validate email
      const normalisedEmail = email.toLowerCase().trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalisedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // 3. Validate email is Waikato staff domain
      if (!isWaikatoStaffEmail(normalisedEmail)) {
        return res.status(400).json({
          error: "Admin email must use @waikato.ac.nz domain",
        });
      }

      // 4. Validate password strength
      // Must have: at least 8 characters, >=1 uppercase, >=1 special char
      if (password.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }

      const hasUppercase = /[A-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
        password
      );
      if (!hasUppercase || !hasSpecialChar) {
        return res.status(400).json({
          error:
            "Password must contain at least one uppercase letter and one special character",
        });
      }

      // 5. Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalisedEmail },
      });

      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      // 6. Validate and retrieve admin invite
      const trimmedCode = inviteCode.trim();
      const adminInvite = await prisma.adminInvite.findUnique({
        where: { email: normalisedEmail },
        select: {
          id: true,
          email: true,
          code: true,
          codeHash: true,
          expiresAt: true,
          usedAt: true,
        },
      });

      if (!adminInvite) {
        return res.status(404).json({ error: "No invitation found for this email" });
      }

      // 7. Check if invite code matches (prefer hashed comparison when available)
      const hasHash = !!adminInvite.codeHash;
      if (hasHash) {
        const isValid = await bcrypt.compare(trimmedCode, adminInvite.codeHash!);
        if (!isValid) {
          return res.status(400).json({ error: "Invalid invitation code" });
        }
      } else {
        if (adminInvite.code !== trimmedCode) {
          return res.status(400).json({ error: "Invalid invitation code" });
        }
      }

      // 8. Check if invite has been used
      if (adminInvite.usedAt) {
        return res.status(400).json({ error: "This invitation has already been used" });
      }

      // 9. Check if invite has expired
      const now = new Date();
      if (adminInvite.expiresAt < now) {
        return res.status(400).json({ error: "This invitation has expired" });
      }

      // 10. Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // 11. Create admin user (in transaction to ensure atomicity)
      const newAdmin = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            name: trimmedFullName || formatNameFromEmail(normalisedEmail),
            email: normalisedEmail,
            passwordHash,
            passwordUpdatedAt: new Date(),
            role: "admin",
            approvalStatus: "approved",
            mentoringTypes: [],
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

        // Mark invite as used
        await tx.adminInvite.update({
          where: { id: adminInvite.id },
          data: { usedAt: new Date() },
        });

        return user;
      });

      // 12. Respond with success (do NOT return passwordHash)
      return res.status(201).json({
        message: "Admin registered successfully",
        admin: newAdmin,
      });
    } catch (error) {
      console.error("Admin registration error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
