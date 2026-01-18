import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

/**
 * GET /get-verification-code/:email
 * 
 * Get the latest verification code for an email (for testing/debugging)
 * Only returns codes that haven't been used and haven't expired
 */
router.get(
  "/:email",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const normalisedEmail = email.toLowerCase().trim();

      // Get the latest unused verification code for this email
      const verification = await prisma.emailVerification.findFirst({
        where: {
          email: normalisedEmail,
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
          error: "No active verification code found for this email",
        });
      }

      return res.json({
        email: verification.email,
        code: verification.code,
        expiresAt: verification.expiresAt,
        createdAt: verification.createdAt,
      });
    } catch (error) {
      console.error("Get verification code error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

