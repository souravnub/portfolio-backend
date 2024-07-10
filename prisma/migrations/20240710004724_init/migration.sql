-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "yearOfProduction" TEXT NOT NULL,
    "techUsed" TEXT[],
    "description" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "brandColor" TEXT NOT NULL,
    "brandImageUrl" TEXT NOT NULL,
    "brandNameImageUrl" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "mobileImageUrl1" TEXT NOT NULL,
    "mobileImageUrl2" TEXT NOT NULL,
    "mobileVideoUrl" TEXT NOT NULL,
    "productionLink" TEXT NOT NULL,
    "githubLink" TEXT NOT NULL,
    "inSiteLinkText" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillsEnhanced" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SkillsEnhanced_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SkillsEnhanced" ADD CONSTRAINT "SkillsEnhanced_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
