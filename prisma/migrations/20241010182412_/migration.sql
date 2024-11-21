/*
  Warnings:

  - You are about to drop the column `assigneeId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_assigneeId_fkey`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `assigneeId`,
    ADD COLUMN `assignerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_assignerId_fkey` FOREIGN KEY (`assignerId`) REFERENCES `Employer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
