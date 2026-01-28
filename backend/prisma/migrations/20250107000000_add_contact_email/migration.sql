-- AlterTable
-- Make safe on fresh DBs where "User" may not exist yet.
ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;

