-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_queueId_fkey`;

-- DropIndex
DROP INDEX `User_queueId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `details` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `queueId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_queueId_fkey` FOREIGN KEY (`queueId`) REFERENCES `Queue`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
