import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Configure multer storage for profile photos
const uploadDir = path.join(__dirname, "..", "..", "uploads", "profile-photos");

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file, cb) => {
    // Filename format: userId_timestamp.ext
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return cb(new Error("User ID is required for profile photo upload"), "");
    }
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${userId}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

// File filter to allow only images
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: JPEG, PNG, WebP`));
  }
};

// Create multer instance with constraints
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

// Wrap multer upload to return JSON errors instead of default handler
const uploadSingleWithErrors = (fieldName: string) => (
  req: AuthRequest,
  res: Response,
  next: (err?: any) => void
) => {
  upload.single(fieldName)(req as any, res as any, (err: any) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File size exceeds 2MB limit" });
      }
      return res.status(400).json({ error: err.message });
    }

    if (err.message && err.message.includes("Invalid file type")) {
      return res.status(400).json({ error: err.message });
    }

    console.error("Profile photo upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  });
};

/**
 * POST /users/me/profile-photo
 * 
 * Upload profile photo for current user
 * - Requires authentication
 * - Accepts JPEG, PNG, WebP
 * - Max 2MB file size
 * - Stores under /uploads/profile-photos/
 */
router.post(
  "/users/me/profile-photo",
  authenticate,
  uploadSingleWithErrors("file"),
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Delete old profile photo if it exists
      const existingUser = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { profilePhotoFileName: true },
      });

      if (existingUser?.profilePhotoFileName) {
        const oldFilePath = path.join(uploadDir, existingUser.profilePhotoFileName);
        try {
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (err) {
          console.error("Error deleting old profile photo:", err);
          // Continue anyway - don't block upload if old file deletion fails
        }
      }

      // Update user record with new photo info
      const filename = req.file.filename;
      const filePath = `/uploads/profile-photos/${filename}`;

      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data: {
          profilePhotoFileName: filename,
          profilePhotoFilePath: filePath,
          profilePhotoUploadedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profilePhotoFilePath: true,
        },
      });

      return res.json({
        message: "Profile photo uploaded successfully",
        profilePhotoUrl: filePath,
        user: updatedUser,
      });
    } catch (error: any) {
      // Handle multer errors
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File size exceeds 2MB limit" });
        }
        if (error.code === "LIMIT_PART_COUNT") {
          return res.status(400).json({ error: "Too many file parts" });
        }
      }

      if (error.message && error.message.includes("Invalid file type")) {
        return res.status(400).json({ error: error.message });
      }

      console.error("Upload profile photo error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * DELETE /users/me/profile-photo
 *
 * Delete profile photo for current user
 * - Requires authentication
 * - Removes file from disk (best effort)
 * - Sets profilePhoto fields to null in DB
 * - Returns 200 even if no photo exists (idempotent)
 */
router.delete(
  "/users/me/profile-photo",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // Get current user's photo info
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { profilePhotoFileName: true },
      });

      // If no photo, return success message (idempotent operation)
      if (!user?.profilePhotoFileName) {
        return res.status(200).json({ message: "Profile photo already removed" });
      }

      // Delete file from disk (best effort)
      const filePath = path.join(uploadDir, user.profilePhotoFileName);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error("Error deleting profile photo file:", err);
        // Continue anyway - set DB fields to null even if file deletion fails
      }

      // Update user record to remove photo info
      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data: {
          profilePhotoFileName: null,
          profilePhotoFilePath: null,
          profilePhotoUploadedAt: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profilePhotoFilePath: true,
        },
      });

      return res.json({
        message: "Profile photo deleted successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Delete profile photo error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
