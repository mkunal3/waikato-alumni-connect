import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { sendVerificationCodeEmail } from "../services/emailService";

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
 * The code expires in 48 hours.
 * 
 * Prevents regeneration of codes while a valid (non-expired, non-used) code exists.
 * 
 * Sends verification code via email. If SMTP is not configured,
 * uses test account (ethereal.email) for development.
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

      // 3. Check if a valid code already exists for this email
      const existing = await prisma.emailVerification.findFirst({
        where: {
          email: normalisedEmail,
          purpose: "EMAIL_VERIFICATION",
          usedAt: null,
          expiresAt: { gt: new Date() }
        }
      });

      if (existing) {
        return res.status(429).json({
          error: "A verification code has already been generated. Please use the existing code or wait until it expires.",
          expiresAt: existing.expiresAt
        });
      }

      // 4. Generate verification code
      const code = generateVerificationCode();

      // 5. Calculate expiration (48 hours from now)
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

      // 6. Store in database using upsert to avoid unique constraint collisions
      await prisma.emailVerification.upsert({
        where: {
          email_purpose: {
            email: normalisedEmail,
            purpose: "EMAIL_VERIFICATION",
          },
        },
        update: {
          code,
          expiresAt,
          usedAt: null,
        },
        create: {
          email: normalisedEmail,
          code,
          expiresAt,
          purpose: "EMAIL_VERIFICATION",
        },
      });

      // 7. Send verification code via email
      // Check if SMTP is configured
      const isSMTPConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
      
      try {
        const emailResult = await sendVerificationCodeEmail(normalisedEmail, code);
        
        if (!isSMTPConfigured) {
          // Test mode (no SMTP): log verification code to console
          console.log(`\n========================================`);
          console.log(`Verification code for ${normalisedEmail}: ${code}`);
          console.log(`========================================\n`);
        } else {
          // Production mode: email sent successfully
          console.log(`Verification code email sent to ${normalisedEmail}`);
        }
      } catch (emailError) {
        console.error("Failed to send email, but code is saved:", emailError);
        // Log code to console as fallback
        console.log(`\n========================================`);
        console.log(`Verification code for ${normalisedEmail}: ${code}`);
        console.log(`========================================\n`);
        // Continue - code is already saved in database
      }

      // 8. Return success response (do not return the code to client)
      return res.json({ message: "Verification code sent" });
    } catch (error) {
      console.error("Send verification code error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
