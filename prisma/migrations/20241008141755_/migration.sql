/*
  Warnings:

  - A unique constraint covering the columns `[employeID]` on the table `Ordinateur` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Ordinateur` ADD COLUMN `employeID` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ordinateur_employeID_key` ON `Ordinateur`(`employeID`);
