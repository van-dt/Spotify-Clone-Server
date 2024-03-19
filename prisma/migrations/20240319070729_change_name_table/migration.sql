/*
  Warnings:

  - You are about to drop the `Song` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_userId_fkey";

-- DropForeignKey
ALTER TABLE "liked_song" DROP CONSTRAINT "liked_song_songId_fkey";

-- DropForeignKey
ALTER TABLE "liked_song" DROP CONSTRAINT "liked_song_userId_fkey";

-- DropTable
DROP TABLE "Song";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "avatar_url" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "song_path" TEXT NOT NULL,
    "image_path" TEXT,
    "author" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_song" ADD CONSTRAINT "liked_song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_song" ADD CONSTRAINT "liked_song_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
