import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables before Prisma uses DATABASE_URL
dotenv.config();

const prisma = new PrismaClient();

export default prisma;
