/*
  Warnings:

  - Made the column `queueId` on table `post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_queueId_fkey`;

-- DropIndex
DROP INDEX `Post_queueId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `post` MODIFY `queueId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_queueId_fkey` FOREIGN KEY (`queueId`) REFERENCES `Queue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
