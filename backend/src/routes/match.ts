import { Router, Response } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

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

export default router;
