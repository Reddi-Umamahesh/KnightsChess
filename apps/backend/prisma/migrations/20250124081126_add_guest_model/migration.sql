/*
  Warnings:

  - The primary key for the `Guest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Guest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Guest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Guest` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Guest` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_pkey",
DROP COLUMN "id",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "isGuest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Guest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isGuest" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email");
