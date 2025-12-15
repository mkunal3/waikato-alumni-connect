import express, { Request, Response } from "express";
import cors from "cors";

import registerRoute from "./auth/register";
import loginRoute from "./auth/login";
import matchRouter from "./routes/match";
import adminRouter from "./routes/admin";
import prisma from "./prisma";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", registerRoute);
app.use("/auth", loginRoute);
app.use("/match", matchRouter);
app.use("/admin", adminRouter);

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
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});