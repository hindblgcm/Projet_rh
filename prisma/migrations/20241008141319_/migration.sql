/*
  Warnings:

  - You are about to drop the column `employeID` on the `Ordinateur` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Ordinateur_employeID_key` ON `Ordinateur`;

-- AlterTable
ALTER TABLE `Ordinateur` DROP COLUMN `employeID`;
