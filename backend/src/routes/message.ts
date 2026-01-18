import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";
import prisma from "../prisma";

const router = Router();

// GET /message/:matchId - Get all messages for a match
router.get(
  "/:matchId",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const matchId = parseInt(req.params.matchId);
      const userId = req.userId!;

      if (isNaN(matchId)) {
        return res.status(400).json({ error: "Invalid match ID" });
      }

      // Verify user is part of this match
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          student: true,
          alumni: true,
        },
      });

      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      // Check if user is student or alumni in this match
      if (match.studentId !== userId && match.alumniId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Get all messages for this match
      const messages = await prisma.message.findMany({
        where: { matchId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      return res.json({ messages });
    } catch (error) {
      console.error("Get messages error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
