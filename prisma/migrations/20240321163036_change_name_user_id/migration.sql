/*
  Warnings:

  - You are about to drop the column `userId` on the `song` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `song` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "song" DROP CONSTRAINT "song_userId_fkey";

-- AlterTable
ALTER TABLE "song" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
