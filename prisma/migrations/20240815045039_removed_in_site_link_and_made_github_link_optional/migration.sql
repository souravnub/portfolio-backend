/*
  Warnings:

  - You are about to drop the column `inSiteLinkText` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "inSiteLinkText",
ALTER COLUMN "githubLink" DROP NOT NULL;
