/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Employer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeID]` on the table `Ordinateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modele` to the `Ordinateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ordinateur` ADD COLUMN `employeID` INTEGER NULL,
    ADD COLUMN `modele` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employer_id_key` ON `Employer`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Ordinateur_employeID_key` ON `Ordinateur`(`employeID`);
