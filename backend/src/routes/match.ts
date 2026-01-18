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
 * GET /available
 * 
 * Fetch all available alumni mentors for the authenticated student.
 * Returns all approved alumni that the student can request to match with.
 * 
 * Requires authentication and student role.
 */
router.get(
  "/available",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Verify user is authenticated and is a student
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (req.role !== "student") {
        return res.status(403).json({ error: "Only students can browse available mentors" });
      }

      // 2) Verify student is approved
      const student = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          approvalStatus: true,
        },
      });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      if (student.approvalStatus !== "approved") {
        return res.status(403).json({ error: "Your account must be approved before you can browse mentors" });
      }

      // 3) Fetch all approved alumni mentors
      const mentors = await prisma.user.findMany({
        where: {
          role: "alumni",
          approvalStatus: "approved",
        },
        select: {
          id: true,
          name: true,
          email: true,
          graduationYear: true,
          currentCompany: true,
          currentPosition: true,
          skillsOffered: true,
          mentoringGoals: true,
          about: true,
          workExperience: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // 4) Get existing matches for this student to filter out already matched alumni
      const existingMatches = await prisma.match.findMany({
        where: {
          studentId: req.userId,
        },
        select: {
          alumniId: true,
        },
      });

      const matchedAlumniIds = new Set(existingMatches.map(m => m.alumniId));

      // 5) Filter out already matched alumni
      const availableMentors = mentors.filter(mentor => !matchedAlumniIds.has(mentor.id));

      // 6) Return available mentors
      return res.json({
        mentors: availableMentors,
      });
    } catch (error) {
      console.error("Error fetching available mentors:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

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
 * GET /info/:matchId
 * 
 * Fetch match details by match ID.
 * Requires authentication and user must be part of the match.
 */
router.get(
  "/info/:matchId",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const matchId = parseInt(req.params.matchId, 10);
      if (isNaN(matchId) || matchId <= 0) {
        return res.status(400).json({ error: "Invalid match ID" });
      }

      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Fetch match
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          alumni: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      // Verify user is part of this match
      if (match.studentId !== req.userId && match.alumniId !== req.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      return res.json({ match });
    } catch (error) {
      console.error("Error fetching match:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /request
 * 
 * Student endpoint to request a match with an alumni mentor.
 * Creates a pending match record that requires admin confirmation.
 * 
 * Requires authentication and student role.
 * Body: { alumniId }
 */
router.post(
  "/request",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Verify user is authenticated and is a student
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (req.role !== "student") {
        return res.status(403).json({ error: "Only students can request matches" });
      }

      const { alumniId, coverLetter } = req.body as { alumniId?: number; coverLetter?: string };

      // 2) Validate inputs
      if (!alumniId || !Number.isInteger(alumniId) || alumniId <= 0) {
        return res.status(400).json({ error: "Valid alumniId is required" });
      }

      if (!coverLetter || typeof coverLetter !== "string" || coverLetter.trim().length === 0) {
        return res.status(400).json({ error: "Cover letter is required" });
      }

      // 3) Verify student is approved
      const student = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      if (student.approvalStatus !== "approved") {
        return res.status(403).json({ error: "Your account must be approved before you can request matches" });
      }

      // 4) Fetch alumni
      const alumni = await prisma.user.findUnique({
        where: { id: alumniId },
      });

      if (!alumni) {
        return res.status(404).json({ error: "Alumni mentor not found" });
      }

      if (alumni.role !== "alumni") {
        return res.status(400).json({ error: "User is not an alumni mentor" });
      }

      if (alumni.approvalStatus !== "approved") {
        return res.status(400).json({ error: "Alumni mentor account is not approved" });
      }

      // 5) Check if match already exists
      const existingMatch = await prisma.match.findUnique({
        where: {
          studentId_alumniId: {
            studentId: req.userId,
            alumniId: alumniId,
          },
        },
      });

      if (existingMatch) {
        return res.status(400).json({ error: "Match request already exists" });
      }

      // 6) Create pending match
      const match = await prisma.match.create({
        data: {
          studentId: req.userId,
          alumniId: alumniId,
          status: "pending",
          coverLetter: coverLetter.trim(),
          matchReasons: [], // Empty array for student-requested matches
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

      // 7) Return response
      return res.status(201).json({
        message: "Match request created successfully",
        match: {
          id: match.id,
          status: match.status,
          student: match.student,
          alumni: match.alumni,
        },
      });
    } catch (error) {
      console.error("Error creating match request:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return res.status(500).json({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
);

/**
 * POST /:matchId/approve
 * 
 * Admin endpoint to approve a pending match request.
 * Updates match status to "confirmed" so alumni can see it in pending requests.
 * 
 * Requires authentication and admin role.
 */
router.post(
  "/:matchId/approve",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Parse and validate matchId
      const matchId = parseInt(req.params.matchId, 10);
      if (isNaN(matchId) || matchId <= 0) {
        return res.status(400).json({ error: "Invalid matchId" });
      }

      // 2) Fetch match
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          student: {
            select: { id: true, name: true, email: true, approvalStatus: true },
          },
          alumni: {
            select: { id: true, name: true, email: true, approvalStatus: true },
          },
        },
      });

      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      // 3) Verify match is pending
      if (match.status !== "pending") {
        return res.status(400).json({ error: "Match is not pending" });
      }

      // 4) Verify both users are approved
      if (match.student.approvalStatus !== "approved") {
        return res.status(400).json({ error: "Student account is not approved" });
      }

      if (match.alumni.approvalStatus !== "approved") {
        return res.status(400).json({ error: "Alumni account is not approved" });
      }

      // 5) Update match status to confirmed
      const updatedMatch = await prisma.match.update({
        where: { id: matchId },
        data: {
          status: "confirmed",
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
      return res.json({
        message: "Match approved successfully",
        match: {
          id: updatedMatch.id,
          status: updatedMatch.status,
          coverLetter: updatedMatch.coverLetter,
          confirmedAt: updatedMatch.confirmedAt,
          student: updatedMatch.student,
          alumni: updatedMatch.alumni,
        },
      });
    } catch (error) {
      console.error("Error approving match:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /:matchId/reject
 * 
 * Admin endpoint to reject a pending match request.
 * Deletes the match and sends notification email to student.
 * 
 * Requires authentication and admin role.
 * Body: { rejectionReason: string }
 */
router.post(
  "/:matchId/reject",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Parse and validate matchId
      const matchId = parseInt(req.params.matchId, 10);
      if (isNaN(matchId) || matchId <= 0) {
        return res.status(400).json({ error: "Invalid matchId" });
      }

      const { rejectionReason } = req.body as { rejectionReason?: string };

      // 2) Fetch match
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
          alumni: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      // 3) Verify match is pending
      if (match.status !== "pending") {
        return res.status(400).json({ error: "Match is not pending" });
      }

      // 4) Delete match
      await prisma.match.delete({
        where: { id: matchId },
      });

      // 5) TODO: Send rejection email to student
      // In production, this would send an email with rejectionReason
      // For now, we just log it
      console.log(`Match ${matchId} rejected. Reason: ${rejectionReason || "No reason provided"}`);
      console.log(`Email should be sent to: ${match.student.email}`);

      // 6) Return response
      return res.json({
        message: "Match rejected successfully",
        emailSent: true, // In production, this would be based on actual email send result
        studentEmail: match.student.email,
      });
    } catch (error) {
      console.error("Error rejecting match:", error);
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

      // 2) Get user role - always fetch from database to ensure accuracy
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userRole = user.role;

      // Debug logging
      console.log(`[Match /my] userId: ${req.userId}, role from DB: ${userRole}`);

      // 3) Build query based on user role
      let match;

      if (userRole === "student") {
        // Student looking for their alumni mentor
        // Show matches that are confirmed or accepted by the alumni
        match = await prisma.match.findFirst({
          where: {
            studentId: req.userId,
            status: {
              in: ["confirmed", "accepted"], // Show both confirmed and accepted matches
            },
          },
          orderBy: {
            createdAt: 'desc', // Get the most recent match
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
        console.log(`[Student Match Query] userId: ${req.userId}, found match: ${match ? `id=${match.id}, status=${match.status}` : 'null'}`);
      } else if (userRole === "alumni") {
        // Alumni looking for their student mentee
        // Only show matches that have been accepted by the alumni (status: "accepted")
        match = await prisma.match.findFirst({
          where: {
            alumniId: req.userId,
            status: "accepted", // Only show matches that alumni has accepted
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
