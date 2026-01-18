import { Router, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";
import path from "path";
import fs from "fs";

const router = Router();

/**
 * Local middleware: Require alumni role
 * Returns 403 if user is not an alumni
 */
const requireAlumni = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.role !== "alumni") {
    res.status(403).json({ error: "Forbidden: Only alumni mentors can access this resource" });
    return;
  }
  next();
};

/**
 * GET /pending-requests
 * 
 * Fetch all confirmed match requests for the authenticated alumni mentor.
 * These are matches that have been approved by admin and are waiting for alumni to accept/decline.
 * 
 * Requires authentication and alumni role.
 */
router.get(
  "/pending-requests",
  authenticate,
  requireAlumni,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Verify user is authenticated
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // 2) Fetch all confirmed matches for this alumni
      const matches = await prisma.match.findMany({
        where: {
          alumniId: req.userId,
          status: "confirmed",
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
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
          },
        },
        orderBy: {
          confirmedAt: "desc",
        },
      });

      // 3) Format response to match frontend expectations
      const requests = matches.map((match) => ({
        id: match.id,
        studentDbId: match.student.id, // Add student's database ID for API calls
        name: match.student.name,
        email: match.student.email,
        studentId: match.student.studentId, // Keep studentId as string ID for display
        contactEmail: match.student.contactEmail,
        degree: match.student.degree,
        yearOfStudy: match.student.yearOfStudy,
        expectedGraduation: match.student.expectedGraduation,
        academicFocus: match.student.academicFocus,
        mentoringGoals: match.student.mentoringGoals,
        skillsWanted: match.student.skillsWanted,
        matchScore: match.matchScore,
        matchReasons: match.matchReasons,
        coverLetter: match.coverLetter,
        cvFileName: match.student.cvFileName,
        cvFilePath: match.student.cvFilePath,
        cvUploadedAt: match.student.cvUploadedAt,
        about: match.student.about,
        location: match.student.location,
        linkedInUrl: match.student.linkedInUrl,
        githubUrl: match.student.githubUrl,
        portfolioUrl: match.student.portfolioUrl,
        gpa: match.student.gpa,
        languages: match.student.languages,
        interests: match.student.interests,
        workExperience: match.student.workExperience,
        projects: match.student.projects,
        certifications: match.student.certifications,
        createdAt: match.createdAt,
        confirmedAt: match.confirmedAt,
      }));

      // 4) Return response
      return res.json(requests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /mentees
 * 
 * Fetch all current mentees (students) for the authenticated alumni mentor.
 * These are matches that have been accepted by the alumni.
 * 
 * Requires authentication and alumni role.
 */
router.get(
  "/mentees",
  authenticate,
  requireAlumni,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Verify user is authenticated
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // 2) Only return matches that have been accepted by the alumni
      // A match is considered a mentee only if status is "accepted" (alumni has accepted)
      const matches = await prisma.match.findMany({
        where: {
          alumniId: req.userId,
          status: "accepted", // Only return matches that alumni has accepted
        },
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
              about: true,
              location: true,
              contactEmail: true,
              gpa: true,
              linkedInUrl: true,
              githubUrl: true,
              portfolioUrl: true,
              languages: true,
              interests: true,
              workExperience: true,
              projects: true,
              certifications: true,
              cvFileName: true,
              cvFilePath: true,
              cvUploadedAt: true,
              mentoringGoals: true,
              skillsWanted: true,
            },
          },
        },
        orderBy: {
          confirmedAt: "desc",
        },
      });

      // 3) Format response
      const mentees = matches.map((match) => ({
        id: match.id, // Match ID
        studentDbId: match.student.id, // Student's database ID for API calls
        matchId: match.id,
        name: match.student.name,
        email: match.student.email,
        studentId: match.student.studentId,
        degree: match.student.degree,
        yearOfStudy: match.student.yearOfStudy,
        expectedGraduation: match.student.expectedGraduation,
        academicFocus: match.student.academicFocus,
        about: match.student.about,
        location: match.student.location,
        contactEmail: match.student.contactEmail,
        gpa: match.student.gpa,
        linkedInUrl: match.student.linkedInUrl,
        githubUrl: match.student.githubUrl,
        portfolioUrl: match.student.portfolioUrl,
        languages: match.student.languages,
        interests: match.student.interests,
        workExperience: match.student.workExperience,
        projects: match.student.projects,
        certifications: match.student.certifications,
        cvFileName: match.student.cvFileName,
        cvFilePath: match.student.cvFilePath,
        cvUploadedAt: match.student.cvUploadedAt,
        mentoringGoals: match.student.mentoringGoals,
        skillsWanted: match.student.skillsWanted,
        matchedAt: match.confirmedAt,
        status: match.status,
      }));

      // 4) Return response
      return res.json(mentees);
    } catch (error) {
      console.error("Error fetching mentees:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /requests/:requestId/accept
 * 
 * Accept a confirmed match request.
 * This marks the match as accepted by the alumni.
 * 
 * Requires authentication and alumni role.
 */
router.post(
  "/requests/:requestId/accept",
  authenticate,
  requireAlumni,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Parse and validate requestId
      const requestId = parseInt(req.params.requestId, 10);
      if (isNaN(requestId) || requestId <= 0) {
        return res.status(400).json({ error: "Invalid requestId" });
      }

      // 2) Verify user is authenticated
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // 3) Fetch match
      const match = await prisma.match.findUnique({
        where: { id: requestId },
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
        return res.status(404).json({ error: "Match request not found" });
      }

      // 4) Verify match belongs to this alumni
      if (match.alumniId !== req.userId) {
        return res.status(403).json({ error: "You can only accept your own match requests" });
      }

      // 5) Verify match is confirmed
      if (match.status !== "confirmed") {
        return res.status(400).json({ error: "Match request is not confirmed" });
      }

      // 6) Update match to mark it as accepted by alumni
      // We'll use status "accepted" to indicate alumni has accepted
      // Note: This requires the Match model to support "accepted" status
      // For now, we'll update status to "accepted" if the schema supports it
      // Otherwise, we'll need to add an acceptedAt field
      const updatedMatch = await prisma.match.update({
        where: { id: requestId },
        data: {
          status: "accepted", // Change status to indicate alumni acceptance
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

      return res.json({
        message: "Match request accepted successfully",
        match: {
          id: updatedMatch.id,
          status: updatedMatch.status,
          student: updatedMatch.student,
          alumni: updatedMatch.alumni,
        },
      });
    } catch (error) {
      console.error("Error accepting request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /requests/:requestId/decline
 * 
 * Decline a confirmed match request.
 * This deletes the match record.
 * 
 * Requires authentication and alumni role.
 */
router.post(
  "/requests/:requestId/decline",
  authenticate,
  requireAlumni,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Parse and validate requestId
      const requestId = parseInt(req.params.requestId, 10);
      if (isNaN(requestId) || requestId <= 0) {
        return res.status(400).json({ error: "Invalid requestId" });
      }

      // 2) Verify user is authenticated
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // 3) Fetch match
      const match = await prisma.match.findUnique({
        where: { id: requestId },
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!match) {
        return res.status(404).json({ error: "Match request not found" });
      }

      // 4) Verify match belongs to this alumni
      if (match.alumniId !== req.userId) {
        return res.status(403).json({ error: "You can only decline your own match requests" });
      }

      // 5) Delete match
      await prisma.match.delete({
        where: { id: requestId },
      });

      // 6) Return response
      return res.json({
        message: "Match request declined successfully",
        studentEmail: match.student.email,
      });
    } catch (error) {
      console.error("Error declining request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /mentor/students/:id/cv
 *
 * Download/view a student's CV file.
 * Requires alumni role and the student must have a confirmed match with the alumni.
 */
router.get(
  "/students/:id/cv",
  authenticate,
  requireAlumni,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const studentId = parseInt(req.params.id, 10);
      if (isNaN(studentId)) {
        return res.status(400).json({ error: "Invalid student ID" });
      }

      // 1) Verify user is authenticated
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // 2) Verify there's a confirmed match between this alumni and the student
      const match = await prisma.match.findFirst({
        where: {
          alumniId: req.userId,
          studentId: studentId,
          status: { in: ["confirmed", "accepted"] },
        },
      });

      if (!match) {
        return res.status(403).json({ error: "You can only view CVs of students you are matched with" });
      }

      // 3) Fetch student CV file path
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          role: true,
          cvFileName: true,
          cvFilePath: true,
        },
      });

      // 4) Handle student not found
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // 5) Verify it's a student
      if (student.role !== "student") {
        return res.status(400).json({ error: "User is not a student" });
      }

      // 6) Check if CV exists
      if (!student.cvFilePath || !student.cvFileName) {
        return res.status(404).json({ error: "CV not found" });
      }

      // 7) Check if file exists on disk
      if (!fs.existsSync(student.cvFilePath)) {
        return res.status(404).json({ error: "CV file not found on server" });
      }

      // 8) Send file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${student.cvFileName}"`);
      return res.sendFile(path.resolve(student.cvFilePath));
    } catch (error) {
      console.error("CV download error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

