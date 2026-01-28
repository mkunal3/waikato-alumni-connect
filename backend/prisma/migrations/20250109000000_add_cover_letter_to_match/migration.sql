-- AlterTable
-- In some deployments, this migration can run before "Match" is created.
-- Make it safe on fresh databases; the "Match" creation migration also includes this column.
ALTER TABLE IF EXISTS "Match" ADD COLUMN IF NOT EXISTS "coverLetter" TEXT;

