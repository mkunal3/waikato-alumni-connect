-- AlterTable
ALTER TABLE "User" ADD COLUMN     "academicFocus" TEXT,
ADD COLUMN     "cvFileName" TEXT,
ADD COLUMN     "cvFilePath" TEXT,
ADD COLUMN     "cvUploadedAt" TIMESTAMP(3),
ADD COLUMN     "expectedGraduation" TEXT;
