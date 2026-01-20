import { Router, Response, NextFunction } from "express";
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

 * POST /mentors/:id/approve
 * 
 * Approve a pending alumni mentor
 * Requires admin role
 *
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

 * POST /mentors/:id/reject
 * 
 * Reject a pending alumni mentor
 * Requires admin role
 *
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
*/

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

      return res.json({ matches });
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

export default router;
