import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

/**
 * GET /get-latest-verification-code
 * 
 * Get the latest verification code from the database (for testing/debugging)
 * Returns the most recently created unused and non-expired code
 */
router.get(
  "/",
  async (_req: Request, res: Response): Promise<Response | void> => {
    try {
      // Get the latest unused verification code
      const verification = await prisma.emailVerification.findFirst({
        where: {
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
        return res.status(404).json({
          error: "No active verification code found in database",
        });
      }

      return res.json({
        email: verification.email,
        code: verification.code,
        expiresAt: verification.expiresAt,
        createdAt: verification.createdAt,
      });
    } catch (error) {
      console.error("Get latest verification code error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

