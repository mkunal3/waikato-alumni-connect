-- DropIndex
DROP INDEX "EmailVerification_purpose_idx";

-- CreateIndex
CREATE INDEX "EmailVerification_email_purpose_idx" ON "EmailVerification"("email", "purpose");
