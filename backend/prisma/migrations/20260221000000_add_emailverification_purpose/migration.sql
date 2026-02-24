-- CreateEnum
CREATE TYPE "VerificationPurpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- AlterTable - add purpose column as nullable first
ALTER TABLE "EmailVerification" ADD COLUMN "purpose" "VerificationPurpose";

-- Set existing records to EMAIL_VERIFICATION as default (for backward compatibility)
UPDATE "EmailVerification" SET "purpose" = 'EMAIL_VERIFICATION' WHERE "purpose" IS NULL;

-- Make purpose NOT NULL
ALTER TABLE "EmailVerification" ALTER COLUMN "purpose" SET NOT NULL;

-- Drop old index
DROP INDEX "EmailVerification_email_idx";

-- Create new composite unique constraint and indexes
ALTER TABLE "EmailVerification" DROP CONSTRAINT IF EXISTS "EmailVerification_email_key";
ALTER TABLE "EmailVerification" ADD CONSTRAINT "EmailVerification_email_purpose_key" UNIQUE ("email", "purpose");
CREATE INDEX "EmailVerification_email_idx" ON "EmailVerification"("email");
CREATE INDEX "EmailVerification_purpose_idx" ON "EmailVerification"("purpose");
