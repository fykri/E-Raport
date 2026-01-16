/*
  Warnings:

  - A unique constraint covering the columns `[pesertaDidikId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `pesertaDidikId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_pesertaDidikId_key` ON `Users`(`pesertaDidikId`);

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_pesertaDidikId_fkey` FOREIGN KEY (`pesertaDidikId`) REFERENCES `PesertaDidik`(`id_peserta_didik`) ON DELETE SET NULL ON UPDATE CASCADE;
