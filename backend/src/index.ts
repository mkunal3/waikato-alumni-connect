import express, { Request, Response } from "express";
import cors from "cors";

import registerRoute from "./auth/register";
import loginRoute from "./auth/login";
import sendVerificationCodeRoute from "./auth/sendVerificationCode";
import matchRouter from "./routes/match";
import adminRouter from "./routes/admin";
import profileRouter from "./routes/profile";
import studentRouter from "./routes/student";
import mentorRouter from "./routes/mentor";
import messageRouter from "./routes/message";
import getVerificationCodeRouter from "./routes/getVerificationCode";
import getLatestVerificationCodeRouter from "./routes/getLatestVerificationCode";
import prisma from "./prisma";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", registerRoute);
app.use("/auth", loginRoute);
app.use("/auth", sendVerificationCodeRoute);
app.use("/match", matchRouter);
app.use("/admin", adminRouter);
app.use("/profile", profileRouter);
app.use("/student", studentRouter);
app.use("/mentor", mentorRouter);
app.use("/message", messageRouter);
app.use("/get-verification-code", getVerificationCodeRouter);
app.use("/get-latest-verification-code", getLatestVerificationCodeRouter);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Waikato Connect API is running" });
});

// Debug: Fetch all users
app.get("/users", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on http://0.0.0.0:${PORT}`);
});