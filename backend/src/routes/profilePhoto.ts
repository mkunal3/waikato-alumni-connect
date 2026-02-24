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
    const userId = req.userId;
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
  upload.single("file"),
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

      if (!user?.profilePhotoFileName) {
        return res.status(404).json({ error: "No profile photo found" });
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
