-- CreateEnum
CREATE TYPE "XamXamLanguage" AS ENUM ('WOLOF', 'FRANCAIS', 'ARABE');

-- CreateTable
CREATE TABLE "XamXamAdmin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XamXamAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XamXamBook" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Serigne Touba Cheikh Ahmadou Bamba',
    "language" "XamXamLanguage" NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "coverUrl" TEXT,
    "pdfUrl" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "XamXamBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XamXamPlaylist" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "XamXamPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XamXamTrack" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reciter" TEXT,
    "audioUrl" TEXT NOT NULL,
    "duration" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "playlistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XamXamTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XamXamVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "XamXamVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XamXamWird" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "moment" TEXT,
    "language" "XamXamLanguage" NOT NULL,
    "content" TEXT NOT NULL,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "XamXamWird_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "XamXamAdmin_email_key" ON "XamXamAdmin"("email");

-- AddForeignKey
ALTER TABLE "XamXamTrack" ADD CONSTRAINT "XamXamTrack_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "XamXamPlaylist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
