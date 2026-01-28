-- Add missing tables/columns needed by current Prisma schema.
-- This migration is designed to be safe on fresh databases and on redeployments.

-- AlterTable: User
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "mentoringTypes" TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "preferredMentoringType" TEXT;

-- CreateTable: Message
CREATE TABLE IF NOT EXISTS "Message" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Message_matchId_idx" ON "Message"("matchId");
CREATE INDEX IF NOT EXISTS "Message_createdAt_idx" ON "Message"("createdAt");

-- AddForeignKey (guarded by IF NOT EXISTS via exception-safe DO blocks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Message_matchId_fkey'
  ) THEN
    ALTER TABLE "Message"
      ADD CONSTRAINT "Message_matchId_fkey"
      FOREIGN KEY ("matchId") REFERENCES "Match"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Message_senderId_fkey'
  ) THEN
    ALTER TABLE "Message"
      ADD CONSTRAINT "Message_senderId_fkey"
      FOREIGN KEY ("senderId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

