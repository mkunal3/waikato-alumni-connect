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
  contactEmail: true,
  degree: true,
  yearOfStudy: true,
  graduationYear: true,
  currentCompany: true,
  currentPosition: true,
  expectedGraduation: true,
  academicFocus: true,
  mentoringGoals: true,
  skillsOffered: true,
  skillsWanted: true,
  about: true,
  location: true,
  linkedInUrl: true,
  githubUrl: true,
  portfolioUrl: true,
  gpa: true,
  languages: true,
  interests: true,
  workExperience: true,
  projects: true,
  certifications: true,
};

// GET /profile - Fetch authenticated user's full profile
router.get(
  "/",
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
  "/",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const {
        name,
        studentId,
        contactEmail,
        degree,
        yearOfStudy,
        graduationYear,
        currentCompany,
        currentPosition,
        expectedGraduation,
        academicFocus,
        mentoringGoals,
        skillsOffered,
        skillsWanted,
        about,
        location,
        linkedInUrl,
        githubUrl,
        portfolioUrl,
        gpa,
        languages,
        interests,
        workExperience,
        projects,
        certifications,
      } = req.body;

      // Build data object with only provided fields
      const data: Record<string, unknown> = {};

      if (name !== undefined) data.name = name;
      if (studentId !== undefined) data.studentId = studentId;
      if (contactEmail !== undefined) data.contactEmail = contactEmail;
      if (degree !== undefined) data.degree = degree;
      if (yearOfStudy !== undefined) data.yearOfStudy = yearOfStudy;
      if (graduationYear !== undefined) data.graduationYear = graduationYear;
      if (currentCompany !== undefined) data.currentCompany = currentCompany;
      if (currentPosition !== undefined) data.currentPosition = currentPosition;
      if (expectedGraduation !== undefined) data.expectedGraduation = expectedGraduation;
      if (academicFocus !== undefined) data.academicFocus = academicFocus;
      if (mentoringGoals !== undefined) data.mentoringGoals = mentoringGoals;
      if (skillsOffered !== undefined) data.skillsOffered = skillsOffered;
      if (skillsWanted !== undefined) data.skillsWanted = skillsWanted;
      if (about !== undefined) data.about = about;
      if (location !== undefined) data.location = location;
      if (linkedInUrl !== undefined) data.linkedInUrl = linkedInUrl;
      if (githubUrl !== undefined) data.githubUrl = githubUrl;
      if (portfolioUrl !== undefined) data.portfolioUrl = portfolioUrl;
      if (gpa !== undefined) data.gpa = gpa || null;
      if (languages !== undefined) data.languages = languages || [];
      if (interests !== undefined) data.interests = interests || [];
      
      // Handle JSON fields - Prisma Json type accepts arrays, objects, or null
      if (workExperience !== undefined) {
        data.workExperience = (workExperience && Array.isArray(workExperience)) 
          ? workExperience 
          : (workExperience === null || workExperience === undefined ? null : []);
      }
      if (projects !== undefined) {
        data.projects = (projects && Array.isArray(projects)) 
          ? projects 
          : (projects === null || projects === undefined ? null : []);
      }
      if (certifications !== undefined) {
        data.certifications = (certifications && Array.isArray(certifications)) 
          ? certifications 
          : (certifications === null || certifications === undefined ? null : []);
      }

      // Check if at least one field was provided
      if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      console.log("Updating profile with data:", JSON.stringify(data, null, 2));

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
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return res.status(500).json({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

export default router;
