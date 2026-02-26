import { Router, Response, NextFunction } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";
import path from "path";
import fs from "fs";

const router = Router();

/**
 * Middleware: Verify user is an admin
 * 
 * Returns 403 Forbidden if user role is not "admin"
 */
const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
};

const isWaikatoStaffEmail = (email: string): boolean =>
  email.toLowerCase().trim().endsWith("@waikato.ac.nz");

/* OLD mentor approval logic (no longer used)
 *
 * GET /mentors/pending
 * 
 * Fetch all pending alumni mentor approval requests
 * Requires admin role
 *
router.get(
  "/mentors/pending",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const mentors = await prisma.user.findMany({
        where: {
          role: "alumni",
          approvalStatus: "pending",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return res.json({ mentors });
    } catch (error) {
      console.error("Fetch pending mentors error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /admin/users/:userId/deactivate
 * Deactivate a user (student or alumni). Prevents self-deactivation and last-admin deactivation.
 * Requires admin role.
 */
router.post(
  "/users/:userId/deactivate",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      if (req.userId === userId) {
        return res.status(400).json({ error: "You cannot deactivate your own account." });
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, isActive: true },
      });

      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (targetUser.role === "admin") {
        const activeAdmins = await prisma.user.count({
          where: { role: "admin", isActive: true },
        });

        if (activeAdmins <= 1 && targetUser.isActive) {
          return res.status(400).json({ error: "Cannot deactivate the last active administrator." });
        }
      }

      const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          deactivatedAt: new Date(),
          deactivatedById: req.userId!,
          deactivationReason: reason || null,
        },
        select: { id: true, name: true, email: true, role: true, isActive: true },
      });

      return res.json({
        message: "User deactivated",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error deactivating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /admin/users/:userId/reactivate
 * Reactivate a previously deactivated user (student or alumni).
 * Requires admin role.
 */
router.post(
  "/users/:userId/reactivate",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true },
      });

      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: true,
          deactivatedAt: null,
          deactivatedById: null,
          deactivationReason: null,
        },
        select: { id: true, name: true, email: true, role: true, isActive: true },
      });

      return res.json({
        message: "User reactivated",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error reactivating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /mentors/:id/approve
 *
 * Approve a pending alumni mentor
 * Requires admin role
 */
router.post(
  "/mentors/:id/approve",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Parse and validate mentor id
      const mentorId = parseInt(req.params.id, 10);
      if (isNaN(mentorId) || mentorId <= 0) {
        return res.status(400).json({ error: "Invalid mentor id" });
      }

      // 2) Find mentor
      const mentor = await prisma.user.findUnique({
        where: { id: mentorId },
      });

      if (!mentor) {
        return res.status(404).json({ error: "Mentor not found" });
      }

      // 3) Verify user is an alumni mentor
      if (mentor.role !== "alumni") {
        return res.status(400).json({ error: "User is not an alumni mentor" });
      }

      // 4) Update approval status
      const updatedMentor = await prisma.user.update({
        where: { id: mentorId },
        data: { approvalStatus: "approved" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          createdAt: true,
        },
      });

      return res.json({
        message: "Mentor approved successfully",
        mentor: updatedMentor,
      });
    } catch (error) {
      console.error("Approve mentor error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /mentors/:id/reject
 *
 * Reject a pending alumni mentor
 * Requires admin role
 */
router.post(
  "/mentors/:id/reject",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Parse and validate mentor id
      const mentorId = parseInt(req.params.id, 10);
      if (isNaN(mentorId) || mentorId <= 0) {
        return res.status(400).json({ error: "Invalid mentor id" });
      }

      // 2) Find mentor
      const mentor = await prisma.user.findUnique({
        where: { id: mentorId },
      });

      if (!mentor) {
        return res.status(404).json({ error: "Mentor not found" });
      }

      // 3) Verify user is an alumni mentor
      if (mentor.role !== "alumni") {
        return res.status(400).json({ error: "User is not an alumni mentor" });
      }

      // 4) Update approval status
      const updatedMentor = await prisma.user.update({
        where: { id: mentorId },
        data: { approvalStatus: "rejected" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          createdAt: true,
        },
      });

      return res.json({
        message: "Mentor rejected successfully",
        mentor: updatedMentor,
      });
    } catch (error) {
      console.error("Reject mentor error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /students
 * 
 * Fetch all students
 * Requires admin role
 */
router.get(
  "/students",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const students = await prisma.user.findMany({
        where: {
          role: "student",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          isActive: true,
          createdAt: true,
          studentId: true,
          contactEmail: true,
          degree: true,
          yearOfStudy: true,
          expectedGraduation: true,
          academicFocus: true,
          mentoringGoals: true,
          skillsWanted: true,
          cvFileName: true,
          cvFilePath: true,
          cvUploadedAt: true,
          about: true,
          location: true,
          linkedInUrl: true,
          githubUrl: true,
          portfolioUrl: true,
          gpa: true,
          languages: true,
          interests: true,
          workExperience: true,
          projects: true,
          certifications: true,
          profilePhotoFilePath: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json({ students });
    } catch (error) {
      console.error("Fetch all students error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /mentors
 * 
 * Fetch all alumni mentors
 * Requires admin role
 */
router.get(
  "/mentors",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const mentors = await prisma.user.findMany({
        where: {
          role: "alumni",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          isActive: true,
          createdAt: true,
          graduationYear: true,
          currentCompany: true,
          currentPosition: true,
          mentoringGoals: true,
          skillsOffered: true,
          about: true,
          location: true,
          linkedInUrl: true,
          githubUrl: true,
          portfolioUrl: true,
          languages: true,
          interests: true,
          workExperience: true,
          projects: true,
          certifications: true,
          profilePhotoFilePath: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json({ mentors });
    } catch (error) {
      console.error("Fetch all mentors error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /mentors/pending
 * 
 * Fetch all pending alumni mentor approval requests
 * Requires admin role
 */
router.get(
  "/mentors/pending",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const mentors = await prisma.user.findMany({
        where: {
          role: "alumni",
          approvalStatus: "pending",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          createdAt: true,
          graduationYear: true,
          currentCompany: true,
          currentPosition: true,
          mentoringGoals: true,
          skillsOffered: true,
          about: true,
          location: true,
          linkedInUrl: true,
          githubUrl: true,
          portfolioUrl: true,
          languages: true,
          interests: true,
          workExperience: true,
          projects: true,
          certifications: true,
          profilePhotoFilePath: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return res.json({ mentors });
    } catch (error) {
      console.error("Fetch pending mentors error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /students/pending
 * 
 * Fetch all pending student approval requests
 * Requires admin role
 */
router.get(
  "/students/pending",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const students = await prisma.user.findMany({
        where: {
          role: "student",
          approvalStatus: "pending",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          isActive: true,
          createdAt: true,
          studentId: true,
          contactEmail: true,
          degree: true,
          yearOfStudy: true,
          expectedGraduation: true,
          academicFocus: true,
          mentoringGoals: true,
          skillsWanted: true,
          cvFileName: true,
          cvFilePath: true,
          cvUploadedAt: true,
          about: true,
          location: true,
          linkedInUrl: true,
          githubUrl: true,
          portfolioUrl: true,
          gpa: true,
          languages: true,
          interests: true,
          workExperience: true,
          projects: true,
          certifications: true,
          profilePhotoFilePath: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return res.json({ students });
    } catch (error) {
      console.error("Fetch pending students error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /matches
 * 
 * Fetch all matches
 * Requires admin role
 */
router.get(
  "/matches",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const matches = await prisma.match.findMany({
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              studentId: true,
              degree: true,
              yearOfStudy: true,
              expectedGraduation: true,
              academicFocus: true,
              profilePhotoFilePath: true,
            },
          },
          alumni: {
            select: {
              id: true,
              name: true,
              email: true,
              graduationYear: true,
              currentCompany: true,
              currentPosition: true,
              profilePhotoFilePath: true,
            },
          },
          confirmedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Transform the data to ensure confirmedBy is properly serialized
      const formattedMatches = matches.map(match => ({
        ...match,
        confirmedBy: match.confirmedBy || null,
      }));

      return res.json({ matches: formattedMatches });
    } catch (error) {
      console.error("Fetch all matches error:", error);
      // Log more detailed error information
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return res.status(500).json({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

/**
 * POST /students/:id/approve
 * 
 * Approve a pending student
 * Requires admin role
 */
router.post(
  "/students/:id/approve",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Parse and validate student id
      const studentId = parseInt(req.params.id, 10);
      if (isNaN(studentId) || studentId <= 0) {
        return res.status(400).json({ error: "Invalid student id" });
      }

      // 2) Find student
      const student = await prisma.user.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // 3) Verify user is a student
      if (student.role !== "student") {
        return res.status(400).json({ error: "User is not a student" });
      }

      // 4) Update approval status
      const updatedStudent = await prisma.user.update({
        where: { id: studentId },
        data: { approvalStatus: "approved" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          createdAt: true,
        },
      });

      return res.json({
        message: "Student approved successfully",
        student: updatedStudent,
      });
    } catch (error) {
      console.error("Approve student error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /students/:id/reject
 * 
 * Reject a pending student
 * Requires admin role
 */
router.post(
  "/students/:id/reject",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Parse and validate student id
      const studentId = parseInt(req.params.id, 10);
      if (isNaN(studentId) || studentId <= 0) {
        return res.status(400).json({ error: "Invalid student id" });
      }

      // 2) Find student
      const student = await prisma.user.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // 3) Verify user is a student
      if (student.role !== "student") {
        return res.status(400).json({ error: "User is not a student" });
      }

      // 4) Update approval status
      const updatedStudent = await prisma.user.update({
        where: { id: studentId },
        data: { approvalStatus: "rejected" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          createdAt: true,
        },
      });

      return res.json({
        message: "Student rejected successfully",
        student: updatedStudent,
      });
    } catch (error) {
      console.error("Reject student error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /invitation-code
 * 
 * Fetch the currently active invitation code
 * Requires admin role
 */
router.get(
  "/invitation-code",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const activeCode = await prisma.invitationCode.findFirst({
        where: {
          isActive: true,
        },
      });

      return res.json({ code: activeCode?.code || null });
    } catch (error) {
      console.error("Fetch invitation code error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /admin/admin-invitation-code
 *
 * Fetch the currently active admin invitation code
 * Requires admin role
 */
router.get(
  "/admin-invitation-code",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const activeCode = await prisma.adminInvitationCode.findFirst({
        where: {
          isActive: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json({ code: activeCode?.code || null });
    } catch (error) {
      console.error("Fetch admin invitation code error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /admin/admin-invites
 * Create or refresh an admin invite for a specific @waikato.ac.nz email.
 * Generates a secure token valid for 48 hours. Requires admin role.
 */
router.post(
  "/admin-invites",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const { email } = req.body as { email?: string };

      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email is required" });
      }

      const normalisedEmail = email.toLowerCase().trim();

      if (!isWaikatoStaffEmail(normalisedEmail)) {
        return res
          .status(400)
          .json({ error: "Admin invites must use a @waikato.ac.nz email" });
      }

      const code = crypto.randomBytes(16).toString("hex");
      const codeHash = await bcrypt.hash(code, 10);
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

      const invite = await prisma.adminInvite.upsert({
        where: { email: normalisedEmail },
        update: {
          code,
          codeHash,
          expiresAt,
          usedAt: null,
          createdById: req.userId!,
        },
        create: {
          email: normalisedEmail,
          code,
          codeHash,
          expiresAt,
          createdById: req.userId!,
        },
      });

      return res.status(201).json({
        message: "Admin invite generated",
        invite: {
          email: invite.email,
          code, // Return plain code once during pilot
          expiresAt: invite.expiresAt,
        },
      });
    } catch (error) {
      console.error("Create admin invite error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /admin/admin-invites/pending
 * List pending (unused, unexpired) admin invites. Requires admin role.
 */
router.get(
  "/admin-invites/pending",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const now = new Date();
      const invites = await prisma.adminInvite.findMany({
        where: {
          usedAt: null,
          expiresAt: {
            gt: now,
          },
        },
        select: {
          email: true,
          expiresAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json({ invites });
    } catch (error) {
      console.error("List admin invites error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /invitation-code
 * 
 * Create a new active invitation code
 * Automatically deactivates all previous active codes
 * Requires admin role
 */
router.post(
  "/invitation-code",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const { code } = req.body as { code?: string };

      // 1) Validate code is provided and non-empty
      if (!code || typeof code !== "string" || code.trim().length === 0) {
        return res.status(400).json({ error: "Code must be a non-empty string" });
      }

      const trimmedCode = code.trim();

      // 2) Deactivate all existing active codes
      await prisma.invitationCode.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      // 3) Create new active invitation code
      const newCode = await prisma.invitationCode.create({
        data: {
          code: trimmedCode,
          isActive: true,
        },
      });

      return res.status(201).json({
        message: "New invitation code created",
        invitationCode: newCode,
      });
    } catch (error) {
      console.error("Create invitation code error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /admin/admin-invitation-code
 *
 * Create a new active admin invitation code
 * Automatically deactivates all previous active admin codes
 * Requires admin role
 */
router.post(
  "/admin-invitation-code",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const { code } = req.body as { code?: string };

      if (!code || typeof code !== "string" || code.trim().length === 0) {
        return res.status(400).json({ error: "Code must be a non-empty string" });
      }

      const trimmedCode = code.trim();

      await prisma.adminInvitationCode.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      const newCode = await prisma.adminInvitationCode.create({
        data: {
          code: trimmedCode,
          isActive: true,
        },
      });

      return res.status(201).json({
        message: "New admin invitation code created",
        invitationCode: newCode,
      });
    } catch (error) {
      console.error("Create admin invitation code error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /statistics
 * 
 * Fetch admin dashboard statistics
 * Includes user counts and matching metrics
 * Requires admin role
 */
router.get(
  "/statistics",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // Use Promise.all for parallel database queries
      const [totalStudents, totalAlumni, pendingStudents, totalMatches] =
        await Promise.all([
          prisma.user.count({
            where: {
              role: "student",
            },
          }),
          prisma.user.count({
            where: {
              role: "alumni",
            },
          }),
          prisma.user.count({
            where: {
              role: "student",
              approvalStatus: "pending",
            },
          }),
          prisma.match.count(),
        ]);

      return res.json({
        totalStudents,
        totalAlumni,
        pendingStudents,
        totalMatches,
      });
    } catch (error) {
      console.error("Error fetching admin statistics:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /admin/students/:id/cv
 *
 * Download/view a student's CV file.
 * Requires admin role.
 */
router.get(
  "/students/:id/cv",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const studentId = parseInt(req.params.id, 10);
      if (isNaN(studentId)) {
        return res.status(400).json({ error: "Invalid student ID" });
      }

      // 1) Fetch student CV file path
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          role: true,
          cvFileName: true,
          cvFilePath: true,
        },
      });

      // 2) Handle student not found
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // 3) Verify it's a student
      if (student.role !== "student") {
        return res.status(400).json({ error: "User is not a student" });
      }

      // 4) Check if CV exists
      if (!student.cvFileName) {
        return res.status(404).json({ error: "CV not found" });
      }

      // 5) Check if file path exists
      if (!student.cvFilePath) {
        return res.status(404).json({ error: "CV file path not found. The CV may have been uploaded before file storage was implemented. Please ask the student to re-upload their CV." });
      }

      // 6) Check if file exists on disk
      const filePath = path.isAbsolute(student.cvFilePath) 
        ? student.cvFilePath 
        : path.join(process.cwd(), student.cvFilePath);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "CV file not found on server. The file may have been deleted or moved." });
      }

      // 7) Send file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${student.cvFileName}"`);
      return res.sendFile(path.resolve(filePath));
    } catch (error) {
      console.error("CV download error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /matches/create
 * 
 * Admin manually creates a match between a student and an alumni.
 * This allows admin to proactively connect students with alumni.
 * 
 * Requires authentication and admin role.
 */
router.post(
  "/matches/create",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const { studentId, alumniId, coverLetter } = req.body as {
        studentId?: number;
        alumniId?: number;
        coverLetter?: string;
      };

      // Validate input
      if (!studentId || !alumniId) {
        return res.status(400).json({ error: "Student ID and Alumni ID are required" });
      }

      // Verify student exists and is approved
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: { id: true, role: true, approvalStatus: true },
      });

      if (!student || student.role !== "student") {
        return res.status(400).json({ error: "Invalid student ID" });
      }

      if (student.approvalStatus !== "approved") {
        return res.status(400).json({ error: "Student must be approved before matching" });
      }

      // Verify alumni exists and is approved
      const alumni = await prisma.user.findUnique({
        where: { id: alumniId },
        select: { id: true, role: true, approvalStatus: true },
      });

      if (!alumni || alumni.role !== "alumni") {
        return res.status(400).json({ error: "Invalid alumni ID" });
      }

      if (alumni.approvalStatus !== "approved") {
        return res.status(400).json({ error: "Alumni must be approved before matching" });
      }

      // Check if match already exists
      const existingMatch = await prisma.match.findUnique({
        where: {
          studentId_alumniId: {
            studentId,
            alumniId,
          },
        },
      });

      if (existingMatch) {
        return res.status(400).json({ error: "Match already exists between this student and alumni" });
      }

      // Get admin user ID
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Create match with "confirmed" status (admin approved, waiting for alumni)
      const match = await prisma.match.create({
        data: {
          studentId,
          alumniId,
          status: "confirmed",
          coverLetter: coverLetter || null,
          confirmedById: req.userId,
          confirmedAt: new Date(),
          matchReasons: ["Admin manually created this match"],
        },
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
          alumni: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return res.status(201).json({
        message: "Match created successfully",
        match,
      });
    } catch (error) {
      console.error("Error creating match:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/matches/:matchId/cancel",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const { matchId } = req.params;
      const { reason } = req.body as { reason?: string };

      const matchIdNum = parseInt(matchId, 10);
      if (isNaN(matchIdNum)) {
        return res.status(400).json({ error: "Invalid match ID" });
      }

      const match = await prisma.match.findUnique({
        where: { id: matchIdNum },
      });

      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      if (match.status === "completed") {
        return res.status(400).json({ error: "Cannot cancel a completed match" });
      }

      if (match.status === "cancelled") {
        return res.status(400).json({ error: "Match is already cancelled" });
      }

      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await prisma.match.update({
        where: { id: matchIdNum },
        data: {
          status: "cancelled",
          cancelledAt: new Date(),
          cancelledById: req.userId,
          cancelReason: reason || null,
        },
      });

      return res.json({ message: "Match cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling match:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /admin/users
 * Admin can create a new user manually (e.g., for staff onboarding).
 * User is created with a temporary password and mustChangePassword flag.
 * Requires admin role.
 */
router.post(
  "/users",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const { email, name, role } = req.body as {
        email?: string;
        name?: string;
        role?: string;
      };

      if (!email || !name || !role) {
        return res
          .status(400)
          .json({ error: "Email, name, and role are required" });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        return res.status(409).json({ error: "User with this email already exists" });
      }

      // Generate temporary password
      const temporaryPassword = crypto.randomBytes(12).toString("hex");
      const passwordHash = await bcrypt.hash(temporaryPassword, 10);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name,
          role: role as "student" | "alumni" | "admin",
          passwordHash,
          approvalStatus: role === "admin" ? "approved" : "pending",
          mustChangePassword: true,
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

      return res.status(201).json({
        message: "User created successfully",
        user: newUser,
        temporaryPassword, // Return once for admin to share
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /admin/users/:userId/reset-password
 * Admin can reset a user's password to a temporary one.
 * The user will be required to change it on next login.
 * Requires admin role.
 */
router.post(
  "/users/:userId/reset-password",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate a temporary password
      const temporaryPassword = crypto.randomBytes(12).toString("hex");
      const passwordHash = await bcrypt.hash(temporaryPassword, 10);

      // Update user password and set mustChangePassword flag
      await prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash,
          passwordUpdatedAt: new Date(),
          mustChangePassword: true,
        },
      });

      return res.json({
        message: "Password reset successfully",
        userId,
        email: user.email,
        temporaryPassword, // Return once for admin to share with user
        userMustChangePassword: true,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /admin/admins
 * List all admins with status information.
 * Returns: id, name, email, isActive, passwordUpdatedAt, createdAt
 * Requires admin role.
 */
router.get(
  "/admins",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const admins = await prisma.user.findMany({
        where: { role: "admin" },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          passwordUpdatedAt: true,
          createdAt: true,
          profilePhotoFilePath: true,
        },
        orderBy: { email: "asc" },
      });

      return res.json({ admins });
    } catch (error) {
      console.error("Error listing admins:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /admin/admins/:adminId/deactivate
 * Deactivate an admin account (prevent login).
 * Prevents deactivating the last active admin.
 * Requires admin role.
 */
router.post(
  "/admins/:adminId/deactivate",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const adminId = parseInt(req.params.adminId, 10);
      if (isNaN(adminId)) {
        return res.status(400).json({ error: "Invalid admin ID" });
      }

      // Check if requesting admin is trying to deactivate another admin
      if (adminId !== req.userId) {
        return res.status(403).json({ error: "You can only deactivate your own account." });
      }

      // Verify target admin exists and has admin role
      const targetAdmin = await prisma.user.findUnique({
        where: { id: adminId },
        select: { id: true, role: true, isActive: true, email: true },
      });

      if (!targetAdmin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      if (targetAdmin.role !== "admin") {
        return res.status(400).json({ error: "User is not an admin" });
      }

      // Check if this is the last active admin
      const activeAdminsCount = await prisma.user.count({
        where: { role: "admin", isActive: true },
      });

      if (activeAdminsCount <= 1 && targetAdmin.isActive) {
        return res
          .status(403)
          .json({ error: "Cannot deactivate the last active admin." });
      }

      // Deactivate the admin
      const updatedAdmin = await prisma.user.update({
        where: { id: adminId },
        data: {
          isActive: false,
          deactivatedAt: new Date(),
          deactivatedById: req.userId!,
        },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          passwordUpdatedAt: true,
          createdAt: true,
        },
      });

      return res.json({
        message: "Admin deactivated successfully",
        admin: updatedAdmin,
      });
    } catch (error) {
      console.error("Error deactivating admin:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /admin/admins/:adminId/reactivate
 * Reactivate a deactivated admin account.
 * Requires admin role.
 */
router.post(
  "/admins/:adminId/reactivate",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const adminId = parseInt(req.params.adminId, 10);
      if (isNaN(adminId)) {
        return res.status(400).json({ error: "Invalid admin ID" });
      }

      // Prevent self-reactivation
      if (adminId === req.userId) {
        return res.status(403).json({ error: "You cannot reactivate your own account. Ask another admin." });
      }

      // Verify target admin exists and has admin role
      const targetAdmin = await prisma.user.findUnique({
        where: { id: adminId },
        select: { id: true, role: true, email: true },
      });

      if (!targetAdmin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      if (targetAdmin.role !== "admin") {
        return res.status(400).json({ error: "User is not an admin" });
      }

      // Reactivate the admin
      const updatedAdmin = await prisma.user.update({
        where: { id: adminId },
        data: { isActive: true },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          passwordUpdatedAt: true,
          createdAt: true,
        },
      });

      return res.json({
        message: "Admin reactivated successfully",
        admin: updatedAdmin,
      });
    } catch (error) {
      console.error("Error reactivating admin:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /admin/users/:userId/deactivate
 * Deactivate any user account (students, alumni, or admins).
 * Prevents self-deactivation.
 * Body: { reason?: string }
 * Requires admin role.
 */
router.post(
  "/users/:userId/deactivate",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Prevent self-deactivation
      if (userId === req.userId) {
        return res.status(400).json({ error: "You cannot deactivate your own account." });
      }

      // Verify target user exists
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, isActive: true, email: true },
      });

      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Extract optional reason from body
      const { reason } = req.body as { reason?: string };
      const trimmedReason = reason && typeof reason === "string" ? reason.trim() : null;

      // Deactivate the user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          deactivatedAt: new Date(),
          deactivatedById: req.userId!,
          deactivationReason: trimmedReason,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          deactivatedAt: true,
          deactivationReason: true,
        },
      });

      return res.json({
        message: "User deactivated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error deactivating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /admin/users/:userId/reactivate
 * Reactivate a deactivated user account.
 * Requires admin role (any admin can reactivate any user).
 */
router.post(
  "/users/:userId/reactivate",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Verify target user exists
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, email: true },
      });

      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Reactivate the user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: true,
          deactivatedAt: null,
          deactivatedById: null,
          deactivationReason: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      return res.json({
        message: "User reactivated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error reactivating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /admin/verification-codes
 * 
 * Admin-only endpoint to list student email verification codes.
 * Gated behind ALLOW_ADMIN_CODE_VIEW environment variable for security.
 * 
 * Query params (optional):
 * - purpose: EMAIL_VERIFICATION (default) or PASSWORD_RESET
 * - email: optional email filter
 * - status: active|expired|used|all (default: all for auto-polling)
 * - limit: max records to return (default: 100, max: 200)
 */
router.get(
  "/verification-codes",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // Gate endpoint behind environment variable
      if (process.env.ALLOW_ADMIN_CODE_VIEW !== "true") {
        return res.status(403).json({ error: "Not available" });
      }

      const purpose = (req.query.purpose as string) || "EMAIL_VERIFICATION";
      const email = (req.query.email as string) || undefined;
      const status = (req.query.status as string) || "active";
      let limit = parseInt((req.query.limit as string) || "100", 10);

      // Validate and clamp limit
      if (isNaN(limit) || limit < 1) limit = 100;
      if (limit > 200) limit = 200;

      // Fetch all records matching purpose and email filter
      const allCodes = await prisma.emailVerification.findMany({
        where: {
          purpose: purpose as any,
          ...(email && { email: { contains: email, mode: "insensitive" } }),
        },
        orderBy: { createdAt: "desc" },
        take: limit * 2, // Fetch more to filter by status
      });

      const now = new Date();

      // Filter by status and compute status field
      const codesWithStatus = allCodes.map((record) => {
        let computedStatus: "active" | "expired" | "used";

        if (record.usedAt !== null) {
          computedStatus = "used";
        } else if (record.expiresAt < now) {
          computedStatus = "expired";
        } else {
          computedStatus = "active";
        }

        return {
          id: record.id,
          email: record.email,
          code: record.code,
          purpose: record.purpose,
          expiresAt: record.expiresAt.toISOString(),
          usedAt: record.usedAt ? record.usedAt.toISOString() : null,
          createdAt: record.createdAt.toISOString(),
          status: computedStatus,
        };
      });

      const activeCodes = codesWithStatus.filter((c) => c.status === "active");
      const usedCodes = codesWithStatus.filter((c) => c.status === "used");
      const expiredCodes = codesWithStatus.filter((c) => c.status === "expired");

      const filteredCodes = codesWithStatus
        .filter((c) => {
          if (status === "all") return true;
          return c.status === status;
        })
        .slice(0, limit);

      return res.json({
        codes: filteredCodes,
        counts: {
          total: codesWithStatus.length,
          active: activeCodes.length,
          used: usedCodes.length,
          expired: expiredCodes.length,
        },
      });
    } catch (error) {
      console.error("Error fetching verification codes:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * DELETE /admin/verification-codes/:id
 * 
 * Admin-only endpoint to delete a verification code.
 */
router.delete(
  "/verification-codes/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // Validate ID is a number
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid code ID" });
      }

      // Find the code
      const code = await prisma.emailVerification.findUnique({
        where: { id },
      });

      if (!code) {
        return res.status(404).json({ error: "Verification code not found" });
      }

      // Hard delete the record
      await prisma.emailVerification.delete({
        where: { id },
      });

      return res.json({
        message: "Verification code deleted",
        deletedId: id,
      });
    } catch (error) {
      console.error("Error deleting verification code:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /admin/dev/password-reset-code
 *
 * Dev-only helper to fetch the latest active password reset code for an email.
 * Requires admin role. Disabled in production.
 */
router.get(
  "/dev/password-reset-code",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      if (process.env.NODE_ENV === "production") {
        return res.status(404).json({ error: "Not found" });
      }

      const emailParam = (req.query.email as string) || "";

      if (!emailParam || typeof emailParam !== "string") {
        return res.status(400).json({ error: "Email query parameter is required" });
      }

      const email = emailParam.toLowerCase().trim();

      if (!email) {
        return res.status(400).json({ error: "Email query parameter is required" });
      }

      const record = await prisma.emailVerification.findFirst({
        where: {
          email,
          purpose: "PASSWORD_RESET",
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!record) {
        return res.status(404).json({ error: "No active reset code found" });
      }

      return res.json({
        email: record.email,
        code: record.code,
        expiresAt: record.expiresAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
      });
    } catch (error) {
      console.error("Error fetching password reset code:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /admin/password-reset-requests
 *
 * List active (unused, unexpired) password reset requests for admins.
 */
router.get(
  "/password-reset-requests",
  authenticate,
  requireAdmin,
  async (_req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const now = new Date();

      const requests = await prisma.emailVerification.findMany({
        where: {
          purpose: "PASSWORD_RESET",
          usedAt: null,
          expiresAt: { gt: now },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json({
        count: requests.length,
        requests: requests.map((req) => ({
          id: req.id,
          email: req.email,
          code: req.code,
          createdAt: req.createdAt.toISOString(),
          expiresAt: req.expiresAt.toISOString(),
        })),
      });
    } catch (error) {
      console.error("Error fetching password reset requests:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
