/*
  Warnings:

  - You are about to drop the column `civilite` on the `Employer` table. All the data in the column will be lost.
  - You are about to drop the column `ordinateurID` on the `Ordinateur` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[computeurID]` on the table `Employer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mac]` on the table `Ordinateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gender` to the `Employer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entrepriseID` to the `Ordinateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mac` to the `Ordinateur` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Employer` DROP FOREIGN KEY `Employer_computeurID_fkey`;

-- DropForeignKey
ALTER TABLE `Ordinateur` DROP FOREIGN KEY `Ordinateur_ordinateurID_fkey`;

-- AlterTable
ALTER TABLE `Employer` DROP COLUMN `civilite`,
    ADD COLUMN `gender` ENUM('MR', 'MME') NOT NULL,
    MODIFY `computeurID` INTEGER NULL;

-- AlterTable
ALTER TABLE `Ordinateur` DROP COLUMN `ordinateurID`,
    ADD COLUMN `entrepriseID` INTEGER NOT NULL,
    ADD COLUMN `mac` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employer_computeurID_key` ON `Employer`(`computeurID`);

-- CreateIndex
CREATE UNIQUE INDEX `Ordinateur_mac_key` ON `Ordinateur`(`mac`);

-- AddForeignKey
ALTER TABLE `Employer` ADD CONSTRAINT `Employer_computeurID_fkey` FOREIGN KEY (`computeurID`) REFERENCES `Ordinateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ordinateur` ADD CONSTRAINT `Ordinateur_entrepriseID_fkey` FOREIGN KEY (`entrepriseID`) REFERENCES `Entreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
