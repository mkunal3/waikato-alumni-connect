-- NOTE:
-- This project’s migration directories are not ordered chronologically.
-- In fresh databases, this migration can run before the migration that creates "User".
-- To make deploys robust, ensure the base "User" table exists first.

-- CreateTable (base)
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- AlterTable
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "about" TEXT,
  ADD COLUMN IF NOT EXISTS "location" TEXT,
  ADD COLUMN IF NOT EXISTS "linkedInUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "githubUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "portfolioUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "gpa" TEXT,
  ADD COLUMN IF NOT EXISTS "languages" TEXT[],
  ADD COLUMN IF NOT EXISTS "interests" TEXT[],
  ADD COLUMN IF NOT EXISTS "workExperience" JSONB,
  ADD COLUMN IF NOT EXISTS "projects" JSONB,
  ADD COLUMN IF NOT EXISTS "certifications" JSONB;

