import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

/**
 * Helper: Generate 6-digit numeric verification code
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /send-verification-code
 *
 * Generate and store a verification code for the provided email.
 * The code expires in 10 minutes.
 *
 * For testing purposes, the code is logged to console.
 * In production, this should send via email service.
 *
 * Body: { email: string }
 */
router.post(
  "/send-verification-code",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email } = req.body as { email?: string };

      // 1. Validate email is provided
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // 2. Normalize email
      const normalisedEmail = email.toLowerCase().trim();

      // 3. Generate verification code
      const code = generateVerificationCode();

      // 4. Calculate expiration (10 minutes from now)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // 5. Store in database
      await prisma.emailVerification.create({
        data: {
          email: normalisedEmail,
          code,
          expiresAt,
          usedAt: null,
        },
      });

      // 6. Log code for testing (in production, send via email service)
      console.log(`Verification code for ${normalisedEmail}: ${code}`);

      // 7. Return success response
      return res.json({ message: "Verification code sent" });
    } catch (error) {
      console.error("Send verification code error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
