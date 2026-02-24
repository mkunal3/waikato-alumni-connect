import bcrypt from "bcryptjs";
import { Router, Request, Response } from "express";

import prisma from "../prisma";

const router = Router();

// TypeScript types for role validation
type UserRole = "student" | "alumni";

// Minimal helpers for domain checks
const isWaikatoStudentEmail = (email: string): boolean =>
  email.toLowerCase().trim().endsWith("@students.waikato.ac.nz");

const isWaikatoStaffEmail = (email: string): boolean =>
  email.toLowerCase().trim().endsWith("@waikato.ac.nz");

// Note: send-verification-code route is handled by sendVerificationCode.ts
// This file only handles registration

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
 * Registration flow:
 * 1. Students: name, studentId, email, password, verificationCode - verification code required
 * 2. Alumni: name, email, password, invitation code - no verification code required
 * 3. Students are pending approval (can login but cannot browse mentors until approved)
 * 4. Alumni are auto-approved
 */
router.post(
  "/register",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const {
        email,
        password,
        role,
        invitationCode,
        name,
        studentId,
        verificationCode,
      } = req.body as {
        email?: string;
        password?: string;
        role?: UserRole;
        invitationCode?: string;
        name?: string;
        studentId?: string;
        verificationCode?: string;
      };

      // 1. Validate required fields
      if (!email || !password || !role) {
        return res.status(400).json({
          error: "Email, password, and role are required",
        });
      }

      // 1.1. For students, studentId is required
      if (role === "student" && !studentId) {
        return res.status(400).json({
          error: "Student ID is required for student registration",
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

      if (role === "student" && !isWaikatoStudentEmail(normalisedEmail)) {
        return res.status(400).json({
          error: "Students must use their @students.waikato.ac.nz email address",
        });
      }

      // 5. Validate password strength
      // Must have: at least 8 characters, >=1 uppercase, >=1 special char
      // Cannot have: spaces, <, or >
      if (password.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }

      const hasUppercase = /[A-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasInvalidChar = /[\s<>]/.test(password);

      if (!hasUppercase) {
        return res.status(400).json({
          error: "Password must include at least one uppercase letter",
        });
      }

      if (!hasSpecialChar) {
        return res.status(400).json({
          error: "Password must include at least one special character",
        });
      }

      if (!hasNumber) {
        return res.status(400).json({
          error: "Password must include at least one number",
        });
      }

      if (hasInvalidChar) {
        return res.status(400).json({
          error: "Password cannot contain spaces, <, or > characters",
        });
      }

      // 6. For students, validate verification code
      if (role === "student") {
        if (!verificationCode) {
          return res.status(400).json({
            error: "Verification code is required for student registration",
          });
        }

        // Find the latest unused verification code for this email
        const verification = await prisma.emailVerification.findFirst({
          where: {
            email: normalisedEmail,
            code: verificationCode.trim(),
            purpose: "EMAIL_VERIFICATION",
            usedAt: null,
            expiresAt: {
              gt: new Date(), // Not expired
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (!verification) {
          return res.status(400).json({
            error: "Invalid or expired verification code",
          });
        }

        // Mark verification code as used
        await prisma.emailVerification.update({
          where: { id: verification.id },
          data: { usedAt: new Date() },
        });
      }

      // 7. Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalisedEmail },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // 7.1. For students, check if studentId already exists
      if (role === "student" && studentId) {
        const existingStudentId = await prisma.user.findFirst({
          where: {
            role: "student",
            studentId: studentId.trim(),
          },
        });

        if (existingStudentId) {
          return res.status(400).json({ error: "Student ID already registered" });
        }
      }

      // 8. Handle role-specific validation
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

      // 9. Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // 10. Determine user name (fallback to email prefix if not provided)
      const displayName = name || normalisedEmail.split("@")[0];

      // 11. Create user
      const newUser = await prisma.user.create({
        data: {
          name: displayName,
          email: normalisedEmail,
          passwordHash,
          role,
          approvalStatus,
          studentId: role === "student" && studentId ? studentId.trim() : null,
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