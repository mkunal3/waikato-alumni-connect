import { Router, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

/**
 * Local middleware: Require student role
 * Returns 403 if user is not a student
 */
const requireStudent = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.role !== "student") {
    res.status(403).json({ error: "Forbidden: Only students can access this resource" });
    return;
  }
  next();
};

/**
 * POST /cv
 *
 * Upload/update CV metadata for the authenticated student.
 * Stores CV file name and upload timestamp.
 *
 * Body: { fileName: string }
 */
router.post(
  "/cv",
  authenticate,
  requireStudent,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      const { fileName } = req.body as { fileName?: string };

      // 1) Validate fileName is provided and non-empty
      if (!fileName || typeof fileName !== "string" || fileName.trim().length === 0) {
        return res.status(400).json({ error: "fileName must be a non-empty string" });
      }

      // 2) Update user with CV metadata
      const updatedUser = await prisma.user.update({
        where: { id: req.userId! },
        data: {
          cvFileName: fileName.trim(),
          cvUploadedAt: new Date(),
        },
        select: {
          cvFileName: true,
          cvUploadedAt: true,
        },
      });

      // 3) Return response
      return res.json({
        uploaded: true,
        fileName: updatedUser.cvFileName,
        uploadedAt: updatedUser.cvUploadedAt,
      });
    } catch (error) {
      console.error("CV upload error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /cv
 *
 * Fetch the authenticated student's CV metadata.
 * Returns CV file name and upload timestamp if available.
 */
router.get(
  "/cv",
  authenticate,
  requireStudent,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Fetch user CV fields
      const user = await prisma.user.findUnique({
        where: { id: req.userId! },
        select: {
          cvFileName: true,
          cvUploadedAt: true,
        },
      });

      // 2) Handle user not found (should not happen if auth is correct)
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // 3) Return CV status
      if (!user.cvFileName || !user.cvUploadedAt) {
        return res.json({
          uploaded: false,
          fileName: null,
          uploadedAt: null,
        });
      }

      return res.json({
        uploaded: true,
        fileName: user.cvFileName,
        uploadedAt: user.cvUploadedAt,
      });
    } catch (error) {
      console.error("CV fetch error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * DELETE /cv
 *
 * Delete the authenticated student's CV metadata.
 * Clears CV file name and upload timestamp.
 */
router.delete(
  "/cv",
  authenticate,
  requireStudent,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Clear CV metadata
      await prisma.user.update({
        where: { id: req.userId! },
        data: {
          cvFileName: null,
          cvUploadedAt: null,
        },
      });

      // 2) Return response
      return res.json({ uploaded: false });
    } catch (error) {
      console.error("CV delete error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
