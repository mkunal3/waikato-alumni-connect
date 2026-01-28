-- AlterTable
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "currentCompany" TEXT,
  ADD COLUMN IF NOT EXISTS "currentPosition" TEXT,
  ADD COLUMN IF NOT EXISTS "degree" TEXT,
  ADD COLUMN IF NOT EXISTS "graduationYear" INTEGER,
  ADD COLUMN IF NOT EXISTS "mentoringGoals" TEXT[],
  ADD COLUMN IF NOT EXISTS "skillsOffered" TEXT[],
  ADD COLUMN IF NOT EXISTS "skillsWanted" TEXT[],
  ADD COLUMN IF NOT EXISTS "studentId" TEXT,
  ADD COLUMN IF NOT EXISTS "yearOfStudy" INTEGER;

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "alumniId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "matchScore" DOUBLE PRECISION,
    "matchReasons" TEXT[],
    "coverLetter" TEXT,
    "confirmedById" INTEGER,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerification" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvitationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_studentId_alumniId_key" ON "Match"("studentId", "alumniId");

-- CreateIndex
CREATE INDEX "EmailVerification_email_idx" ON "EmailVerification"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationCode_code_key" ON "InvitationCode"("code");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_confirmedById_fkey" FOREIGN KEY ("confirmedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
