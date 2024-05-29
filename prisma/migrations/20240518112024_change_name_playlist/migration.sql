/*
  Warnings:

  - You are about to drop the column `author_name` on the `playlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playlist_name]` on the table `playlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playlist_name` to the `playlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "playlist_author_name_key";

-- AlterTable
ALTER TABLE "playlist" DROP COLUMN "author_name",
ADD COLUMN     "playlist_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "playlist_playlist_name_key" ON "playlist"("playlist_name");
