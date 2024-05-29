/*
  Warnings:

  - You are about to drop the column `category_id` on the `song` table. All the data in the column will be lost.
  - You are about to drop the column `playlist_id` on the `song` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "song" DROP CONSTRAINT "song_category_id_fkey";

-- DropForeignKey
ALTER TABLE "song" DROP CONSTRAINT "song_playlist_id_fkey";

-- AlterTable
ALTER TABLE "song" DROP COLUMN "category_id",
DROP COLUMN "playlist_id";

-- CreateTable
CREATE TABLE "song_category" (
    "song_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "song_category_pkey" PRIMARY KEY ("song_id","category_id")
);

-- CreateTable
CREATE TABLE "song_playlist" (
    "song_id" INTEGER NOT NULL,
    "playlist_id" INTEGER NOT NULL,

    CONSTRAINT "song_playlist_pkey" PRIMARY KEY ("song_id","playlist_id")
);

-- AddForeignKey
ALTER TABLE "song_category" ADD CONSTRAINT "song_category_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_category" ADD CONSTRAINT "song_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_playlist" ADD CONSTRAINT "song_playlist_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_playlist" ADD CONSTRAINT "song_playlist_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
