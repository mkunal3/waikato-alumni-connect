-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePhotoFileName" TEXT,
ADD COLUMN     "profilePhotoFilePath" TEXT,
ADD COLUMN     "profilePhotoUploadedAt" TIMESTAMP(3);
