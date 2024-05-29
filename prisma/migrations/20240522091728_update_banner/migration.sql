-- AlterTable
ALTER TABLE "author" ADD COLUMN     "banner" TEXT;

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "banner" TEXT;

-- AlterTable
ALTER TABLE "playlist" ADD COLUMN     "banner" TEXT;

-- AlterTable
ALTER TABLE "song" ADD COLUMN     "listen_count" INTEGER NOT NULL DEFAULT 0;
