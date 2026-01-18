import { Router, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";
import path from "path";
import fs from "fs";

// Use require for multer
const multer = require("multer");

const router = Router();

// Configure multer for CV file uploads
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'cv');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    // Generate unique filename: userId_timestamp_originalname.pdf
    const userId = (req as AuthRequest).userId;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `cv_${userId}_${timestamp}_${sanitizedName}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

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
 * Upload/update CV file for the authenticated student.
 * Stores CV file, file name, file path, and upload timestamp.
 *
 * Body: multipart/form-data with 'cv' file field
 */
router.post(
  "/cv",
  authenticate,
  requireStudent,
  upload.single('cv'),
  async (req: any, res: Response): Promise<Response | void> => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "CV file is required" });
      }

      // Get existing CV file path to delete old file
      const existingUser = await prisma.user.findUnique({
        where: { id: req.userId! },
        select: { cvFilePath: true },
      });

      // Delete old CV file if exists
      if (existingUser?.cvFilePath && fs.existsSync(existingUser.cvFilePath)) {
        try {
          fs.unlinkSync(existingUser.cvFilePath);
        } catch (err) {
          console.warn("Failed to delete old CV file:", err);
        }
      }

      // Update user with CV metadata
      const updatedUser = await prisma.user.update({
        where: { id: req.userId! },
        data: {
          cvFileName: req.file.originalname,
          cvFilePath: req.file.path,
          cvUploadedAt: new Date(),
        },
        select: {
          cvFileName: true,
          cvFilePath: true,
          cvUploadedAt: true,
        },
      });

      // Return response
      return res.json({
        uploaded: true,
        fileName: updatedUser.cvFileName,
        uploadedAt: updatedUser.cvUploadedAt,
      });
    } catch (error) {
      console.error("CV upload error:", error);
      // Delete uploaded file if database update failed
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.warn("Failed to clean up uploaded file:", err);
        }
      }
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
 * GET /cv/download
 *
 * Download/view the authenticated student's CV file.
 * Returns the PDF file.
 */
router.get(
  "/cv/download",
  authenticate,
  requireStudent,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Fetch user CV file path
      const user = await prisma.user.findUnique({
        where: { id: req.userId! },
        select: {
          cvFileName: true,
          cvFilePath: true,
        },
      });

      // 2) Handle user not found
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // 3) Check if CV exists
      if (!user.cvFileName) {
        return res.status(404).json({ error: "CV not found" });
      }

      // 4) Check if file path exists
      if (!user.cvFilePath) {
        return res.status(404).json({ error: "CV file path not found. Please re-upload your CV." });
      }

      // 5) Check if file exists on disk
      const filePath = path.isAbsolute(user.cvFilePath) 
        ? user.cvFilePath 
        : path.join(process.cwd(), user.cvFilePath);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "CV file not found on server. Please re-upload your CV." });
      }

      // 6) Send file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${user.cvFileName}"`);
      return res.sendFile(path.resolve(filePath));
    } catch (error) {
      console.error("CV download error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * DELETE /cv
 *
 * Delete the authenticated student's CV file and metadata.
 * Deletes the file from disk and clears CV metadata.
 */
router.delete(
  "/cv",
  authenticate,
  requireStudent,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      // 1) Get existing CV file path
      const existingUser = await prisma.user.findUnique({
        where: { id: req.userId! },
        select: { cvFilePath: true },
      });

      // 2) Delete file from disk if exists
      if (existingUser?.cvFilePath && fs.existsSync(existingUser.cvFilePath)) {
        try {
          fs.unlinkSync(existingUser.cvFilePath);
        } catch (err) {
          console.warn("Failed to delete CV file:", err);
        }
      }

      // 3) Clear CV metadata
      await prisma.user.update({
        where: { id: req.userId! },
        data: {
          cvFileName: null,
          cvFilePath: null,
          cvUploadedAt: null,
        },
      });

      // 4) Return response
      return res.json({ uploaded: false });
    } catch (error) {
      console.error("CV delete error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
