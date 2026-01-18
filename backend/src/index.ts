import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";

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
const httpServer = createServer(app);

// CORS configuration - support both development and production
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = frontendUrl.includes(',') 
  ? frontendUrl.split(',').map(url => url.trim())
  : [frontendUrl, "http://localhost:3000"];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = Number(process.env.PORT) || 4000;

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
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

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(new Error("JWT secret not configured"));
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: number;
      email: string;
      role: string;
    };

    // Attach user info to socket
    (socket as any).userId = decoded.userId;
    (socket as any).email = decoded.email;
    (socket as any).role = decoded.role;

    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  const userId = (socket as any).userId;
  const userRole = (socket as any).role;

  console.log(`User ${userId} (${userRole}) connected`);

  // Join room for each match the user is part of
  socket.on("join-match", async (matchId: number) => {
    try {
      // Verify user is part of this match
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        socket.emit("error", { message: "Match not found" });
        return;
      }

      if (match.studentId !== userId && match.alumniId !== userId) {
        socket.emit("error", { message: "Access denied" });
        return;
      }

      socket.join(`match-${matchId}`);
      console.log(`User ${userId} joined match ${matchId}`);
    } catch (error) {
      console.error("Error joining match:", error);
      socket.emit("error", { message: "Failed to join match" });
    }
  });

  // Handle sending messages
  socket.on("send-message", async (data: { matchId: number; content: string }) => {
    try {
      const { matchId, content } = data;

      if (!content || content.trim().length === 0) {
        socket.emit("error", { message: "Message content is required" });
        return;
      }

      // Verify user is part of this match
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        socket.emit("error", { message: "Match not found" });
        return;
      }

      if (match.studentId !== userId && match.alumniId !== userId) {
        socket.emit("error", { message: "Access denied" });
        return;
      }

      // Save message to database
      const message = await prisma.message.create({
        data: {
          matchId,
          senderId: userId,
          content: content.trim(),
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // Emit message to all users in the match room
      io.to(`match-${matchId}`).emit("new-message", message);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
  });
});

// Start server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on http://0.0.0.0:${PORT}`);
});