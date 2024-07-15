-- DropForeignKey
ALTER TABLE "SkillsEnhanced" DROP CONSTRAINT "SkillsEnhanced_projectId_fkey";

-- AddForeignKey
ALTER TABLE "SkillsEnhanced" ADD CONSTRAINT "SkillsEnhanced_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
