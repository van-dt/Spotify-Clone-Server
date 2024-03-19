-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'GUEST');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "avatar_url" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "song_path" TEXT NOT NULL,
    "image_path" TEXT,
    "author" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liked_song" (
    "userId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,

    CONSTRAINT "liked_song_pkey" PRIMARY KEY ("userId","songId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_song" ADD CONSTRAINT "liked_song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_song" ADD CONSTRAINT "liked_song_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
