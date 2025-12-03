import registerRoute from "./auth/register";
import loginRoute from "./auth/login";
import prisma from "./prisma";
import express from "express";
import cors from "cors";


const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/auth", registerRoute);
app.use("/auth", loginRoute);

// Root route
app.get("/", (_req, res) => {
  res.json({ message: "Waikato Alumni Connect API is running" });
});

// Fetch all users (Prisma + PostgreSQL)
app.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
