import { Router, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

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

export default router;
