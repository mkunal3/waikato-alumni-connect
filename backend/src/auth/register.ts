import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    // 1. Extract details sent from frontend
    const { name, email, password, role } = req.body;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 3. Hash password for security
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create user in database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        approvalStatus: "pending", // admin must approve
      },
    });

    // 5. Respond to client
    res.json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;