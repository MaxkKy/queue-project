/*
  Warnings:

  - You are about to drop the column `name` on the `queue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_queueId_fkey`;

-- DropIndex
DROP INDEX `Post_queueId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `userId` INTEGER NULL,
    MODIFY `queueId` INTEGER NULL;

-- AlterTable
ALTER TABLE `queue` DROP COLUMN `name`,
    ADD COLUMN `status` ENUM('WAITING') NOT NULL DEFAULT 'WAITING';

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_queueId_fkey` FOREIGN KEY (`queueId`) REFERENCES `Queue`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
