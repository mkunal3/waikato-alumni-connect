-- AlterTable
ALTER TABLE "User" ADD COLUMN     "about" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "linkedInUrl" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "gpa" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "workExperience" JSONB,
ADD COLUMN     "projects" JSONB,
ADD COLUMN     "certifications" JSONB;

