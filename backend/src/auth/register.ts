import bcrypt from "bcryptjs";
import { Router, Request, Response } from "express";

import prisma from "../prisma";

const router = Router();

// TypeScript types for role validation
type UserRole = "student" | "alumni";

/**
 * Helper: Generate 6-digit numeric verification code
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /auth/send-verification-code
 * 
 * Send a verification code to the provided email address.
 * The code is stored in the EmailVerification table and expires in 10 minutes.
 * 
 * For testing purposes, the code is logged to console.
 * In production, this should be sent via email service.
 * 
 * Body: { email: string, invitationCode?: string }
 */
router.post(
  "/send-verification-code",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email, invitationCode } = req.body as {
        email?: string;
        invitationCode?: string;
      };

      // 1. Validate email is provided
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // 2. Validate email format
      if (!email.includes("@")) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const normalisedEmail = email.toLowerCase().trim();

      // 3. Generate verification code
      const code = generateVerificationCode();

      // 4. Calculate expiration (10 minutes from now)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // 5. Store in database
      await prisma.emailVerification.create({
        data: {
          email: normalisedEmail,
          code,
          expiresAt,
          usedAt: null,
        },
      });

      // 6. Log code for testing (in production, send via email service)
      console.log(`Verification code for ${normalisedEmail}: ${code}`);

      // 7. Return success response
      return res.json({ message: "Verification code sent" });
    } catch (error) {
      console.error("Send verification code error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * OLD REGISTER IMPLEMENTATION - DEPRECATED
 * Kept for reference. This was the original simple registration without email verification.
 * 
 * router.post(
 *   "/register",
 *   async (req: Request, res: Response): Promise<Response | void> => {
 *     try {
 *       const { name, email, password, role } = req.body as {
 *         name?: string;
 *         email?: string;
 *         password?: string;
 *         role?: UserRole;
 *       };
 * 
 *       // 1. Basic validation
 *       if (!name || !email || !password || !role) {
 *         return res.status(400).json({
 *           error: "Name, email, password, and role are required",
 *         });
 *       }
 * 
 *       const normalisedEmail = email.toLowerCase().trim();
 * 
 *       const allowedRoles: UserRole[] = ["student", "alumni"];
 *       if (!allowedRoles.includes(role)) {
 *         return res.status(400).json({ error: "Invalid user role" });
 *       }
 * 
 *       // 2. Check if user already exists
 *       const existingUser = await prisma.user.findUnique({
 *         where: { email: normalisedEmail },
 *       });
 * 
 *       if (existingUser) {
 *         return res.status(400).json({ error: "User already exists" });
 *       }
 * 
 *       // 3. Hash password
 *       const passwordHash = await bcrypt.hash(password, 10);
 * 
 *       // 4. Create user
 *       const newUser = await prisma.user.create({
 *         data: {
 *           name,
 *           email: normalisedEmail,
 *           passwordHash,
 *           role,
 *           approvalStatus: "pending"
 *         },
 *         select: {
 *           id: true,
 *           name: true,
 *           email: true,
 *           role: true,
 *           approvalStatus: true,
 *           createdAt: true,
 *         },
 *       });
 * 
 *       return res.status(201).json({
 *         message: "User registered successfully",
 *         user: newUser,
 *       });
 *     } catch (error) {
 *       console.error("Registration error:", error);
 *       return res.status(500).json({ error: "Internal server error" });
 *     }
 *   }
 * );
 */

/**
 * POST /auth/register
 * 
 * New verification-based registration flow:
 * 1. User provides email verification code (sent via email)
 * 2. Alumni must provide valid invitation code
 * 3. Students are pending approval
 * 4. Alumni are auto-approved
 */
router.post(
  "/register",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const {
        email,
        verificationCode,
        password,
        role,
        invitationCode,
        name,
      } = req.body as {
        email?: string;
        verificationCode?: string;
        password?: string;
        role?: UserRole;
        invitationCode?: string;
        name?: string;
      };

      // 1. Validate required fields
      if (!email || !verificationCode || !password || !role) {
        return res.status(400).json({
          error: "Email, verification code, password, and role are required",
        });
      }

      // 2. Normalize email (trim + lowercase)
      const normalisedEmail = email.toLowerCase().trim();

      // 3. Validate email format with regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalisedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // 4. Validate email domain for students
      const allowedRoles: UserRole[] = ["student", "alumni"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          error: "Role must be 'student' or 'alumni'",
        });
      }

      if (role === "student" && !normalisedEmail.endsWith("@students.waikato.ac.nz")) {
        return res.status(400).json({
          error: "Students must use their @students.waikato.ac.nz email address",
        });
      }

      // 5. Validate password strength
      // Must have: at least 8 chars, >=1 uppercase, >=1 lowercase, >=1 number, >=1 special char
      if (password.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }

      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

      if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        return res.status(400).json({
          error: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
        });
      }

      // 6. Validate verification code format (exactly 6 numeric digits)
      const verificationCodeRegex = /^\d{6}$/;
      if (!verificationCodeRegex.test(verificationCode)) {
        return res.status(400).json({
          error: "Verification code must be exactly 6 numeric digits",
        });
      }

      // 7. Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalisedEmail },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // 8. Verify email verification code
      const verification = await prisma.emailVerification.findFirst({
        where: {
          email: normalisedEmail,
          code: verificationCode,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Check if verification record exists, is unused, and not expired
      if (!verification) {
        return res
          .status(400)
          .json({ error: "Invalid or expired verification code" });
      }

      if (verification.usedAt !== null) {
        return res
          .status(400)
          .json({ error: "Verification code already used" });
      }

      if (verification.expiresAt < new Date()) {
        return res
          .status(400)
          .json({ error: "Invalid or expired verification code" });
      }

      // 9. Mark verification as used
      await prisma.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      });

      // 10. Handle alumni-specific validation
      let approvalStatus = "pending";

      if (role === "alumni") {
        if (!invitationCode) {
          return res
            .status(400)
            .json({ error: "Invitation code is required for alumni" });
        }

        // Validate invitation code
        const validInvitation = await prisma.invitationCode.findUnique({
          where: { code: invitationCode },
        });

        if (!validInvitation || !validInvitation.isActive) {
          return res.status(400).json({ error: "Invalid invitation code" });
        }

        // Alumni are automatically approved
        approvalStatus = "approved";
      }

      // Students are pending approval by default
      if (role === "student") {
        approvalStatus = "pending";
      }

      // 11. Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // 12. Determine user name (fallback to email prefix if not provided)
      const displayName = name || normalisedEmail.split("@")[0];

      // 13. Create user
      const newUser = await prisma.user.create({
        data: {
          name: displayName,
          email: normalisedEmail,
          passwordHash,
          role,
          approvalStatus,
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

      // 14. Respond with created user
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