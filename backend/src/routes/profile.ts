import { Router, Response } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  approvalStatus: true,
  createdAt: true,
  studentId: true,
  degree: true,
  yearOfStudy: true,
  graduationYear: true,
  currentCompany: true,
  currentPosition: true,
  mentoringGoals: true,
  skillsOffered: true,
  skillsWanted: true,
};

// GET /profile - Fetch authenticated user's full profile
router.get(
  "/profile",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: profileSelect,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ user });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// PUT /profile - Update authenticated user's profile
router.put(
  "/profile",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const {
        name,
        studentId,
        degree,
        yearOfStudy,
        graduationYear,
        currentCompany,
        currentPosition,
        mentoringGoals,
        skillsOffered,
        skillsWanted,
      } = req.body;

      // Build data object with only provided fields
      const data: Record<string, unknown> = {};

      if (name !== undefined) data.name = name;
      if (studentId !== undefined) data.studentId = studentId;
      if (degree !== undefined) data.degree = degree;
      if (yearOfStudy !== undefined) data.yearOfStudy = yearOfStudy;
      if (graduationYear !== undefined) data.graduationYear = graduationYear;
      if (currentCompany !== undefined) data.currentCompany = currentCompany;
      if (currentPosition !== undefined) data.currentPosition = currentPosition;
      if (mentoringGoals !== undefined) data.mentoringGoals = mentoringGoals;
      if (skillsOffered !== undefined) data.skillsOffered = skillsOffered;
      if (skillsWanted !== undefined) data.skillsWanted = skillsWanted;

      // Check if at least one field was provided
      if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data,
        select: profileSelect,
      });

      return res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
