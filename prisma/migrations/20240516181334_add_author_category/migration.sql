/*
  Warnings:

  - The primary key for the `liked_song` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `songId` on the `liked_song` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `liked_song` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `song` table. All the data in the column will be lost.
  - Added the required column `song_id` to the `liked_song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `liked_song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `song` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "liked_song" DROP CONSTRAINT "liked_song_songId_fkey";

-- DropForeignKey
ALTER TABLE "liked_song" DROP CONSTRAINT "liked_song_userId_fkey";

-- AlterTable
ALTER TABLE "liked_song" DROP CONSTRAINT "liked_song_pkey",
DROP COLUMN "songId",
DROP COLUMN "userId",
ADD COLUMN     "song_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "liked_song_pkey" PRIMARY KEY ("user_id", "song_id");

-- AlterTable
ALTER TABLE "song" DROP COLUMN "author",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "playlist_id" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "author_name" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liked_author" (
    "user_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "liked_author_pkey" PRIMARY KEY ("user_id","author_id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" SERIAL NOT NULL,
    "author_name" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_name_key" ON "Category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "Author_author_name_key" ON "Author"("author_name");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_author_name_key" ON "Playlist"("author_name");

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_song" ADD CONSTRAINT "liked_song_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_song" ADD CONSTRAINT "liked_song_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_author" ADD CONSTRAINT "liked_author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_author" ADD CONSTRAINT "liked_author_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
