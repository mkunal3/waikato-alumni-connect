import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Local requireAdmin middleware
const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.role !== "admin") {
    res.status(403).json({ error: "Forbidden: Admin access required" });
    return; // returns void, not a Response
  }
  next();
};

/**
 * GET /:menteeId
 * 
 * Fetch a student mentee and return all approved alumni mentors
 * as potential matches.
 * 
 * Requires authentication.
 */
router.get(
  "/:menteeId",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Parse and validate menteeId
      const menteeId = parseInt(req.params.menteeId, 10);
      if (isNaN(menteeId) || menteeId <= 0) {
        return res.status(400).json({ error: "Invalid menteeId" });
      }

      // 2) Fetch mentee
      const mentee = await prisma.user.findUnique({
        where: { id: menteeId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approvalStatus: true,
          createdAt: true,
        },
      });

      // Mentee not found
      if (!mentee) {
        return res.status(404).json({ error: "Mentee not found" });
      }

      // 3) Verify mentee is a student
      if (mentee.role !== "student") {
        return res
          .status(400)
          .json({ error: "User is not a student" });
      }

      // 4) Fetch all approved alumni mentors
      const mentors = await prisma.user.findMany({
        where: {
          role: "alumni",
          approvalStatus: "approved",
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

      // 5) Return matches
      return res.json({
        mentee,
        matches: mentors,
      });
    } catch (error) {
      console.error("Match retrieval error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /confirm
 * 
 * Admin endpoint to confirm a match between a student and alumni mentor.
 * Creates or updates a match record with admin confirmation.
 * 
 * Requires authentication and admin role.
 * Body: { studentId, alumniId, matchScore?, matchReasons? }
 */
router.post(
  "/confirm",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const { studentId, alumniId, matchScore, matchReasons } = req.body as {
        studentId?: number;
        alumniId?: number;
        matchScore?: number;
        matchReasons?: string[];
      };

      // 1) Validate inputs
      if (!studentId || !alumniId) {
        return res
          .status(400)
          .json({ error: "studentId and alumniId are required" });
      }

      if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({ error: "Invalid studentId" });
      }

      if (!Number.isInteger(alumniId) || alumniId <= 0) {
        return res.status(400).json({ error: "Invalid alumniId" });
      }

      // 2) Fetch both users
      const student = await prisma.user.findUnique({
        where: { id: studentId },
      });

      const alumni = await prisma.user.findUnique({
        where: { id: alumniId },
      });

      // Both users must exist
      if (!student || !alumni) {
        return res.status(404).json({ error: "One or both users not found" });
      }

      // 3) Verify roles (one student, one alumni)
      if (student.role !== "student" || alumni.role !== "alumni") {
        return res.status(400).json({
          error: "Student must be role 'student' and alumni must be role 'alumni'",
        });
      }

      // 4) Verify both are approved
      if (student.approvalStatus !== "approved") {
        return res
          .status(400)
          .json({ error: "Student account is not approved" });
      }

      if (alumni.approvalStatus !== "approved") {
        return res
          .status(400)
          .json({ error: "Alumni account is not approved" });
      }

      // 5) Upsert match
      const match = await prisma.match.upsert({
        where: {
          studentId_alumniId: { studentId, alumniId },
        },
        create: {
          studentId,
          alumniId,
          status: "confirmed",
          matchScore: matchScore ?? null,
          matchReasons: matchReasons ?? [],
          confirmedById: req.userId!,
          confirmedAt: new Date(),
        },
        update: {
          status: "confirmed",
          matchScore: matchScore ?? null,
          matchReasons: matchReasons ?? [],
          confirmedById: req.userId!,
          confirmedAt: new Date(),
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

      // 6) Return response
      return res.status(201).json({
        message: "Match confirmed successfully",
        match: {
          id: match.id,
          status: match.status,
          matchScore: match.matchScore,
          matchReasons: match.matchReasons,
          confirmedAt: match.confirmedAt,
          student: match.student,
          alumni: match.alumni,
        },
      });
    } catch (error) {
      console.error("Error confirming match:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /my
 * 
 * Fetch the authenticated user's confirmed match.
 * Students can fetch their alumni mentor, alumni can fetch their student mentee.
 * Returns 200 with match: null if no match found.
 * 
 * Requires authentication.
 */
router.get(
  "/my",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Verify userId is present
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // 2) Build query based on user role
      let match;

      if (req.role === "student") {
        // Student looking for their alumni mentor
        match = await prisma.match.findFirst({
          where: {
            studentId: req.userId,
            status: "confirmed",
          },
          include: {
            student: {
              select: { id: true, name: true, email: true },
            },
            alumni: {
              select: {
                id: true,
                name: true,
                email: true,
                currentCompany: true,
                currentPosition: true,
              },
            },
          },
        });
      } else if (req.role === "alumni") {
        // Alumni looking for their student mentee
        match = await prisma.match.findFirst({
          where: {
            alumniId: req.userId,
            status: "confirmed",
          },
          include: {
            student: {
              select: { id: true, name: true, email: true },
            },
            alumni: {
              select: {
                id: true,
                name: true,
                email: true,
                currentCompany: true,
                currentPosition: true,
              },
            },
          },
        });
      } else {
        // Other roles (e.g., admin) cannot view personal matches
        return res
          .status(400)
          .json({ error: "Only students or alumni can view their match" });
      }

      // 3) Return match (null if not found, 200 OK in either case)
      if (!match) {
        return res.json({ match: null });
      }

      // 4) Return the confirmed match with alumni details
      return res.json({
        match: {
          id: match.id,
          status: match.status,
          matchScore: match.matchScore,
          matchReasons: match.matchReasons,
          confirmedAt: match.confirmedAt,
          student: match.student,
          alumni: match.alumni,
        },
      });
    } catch (error) {
      console.error("Error fetching my match:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
