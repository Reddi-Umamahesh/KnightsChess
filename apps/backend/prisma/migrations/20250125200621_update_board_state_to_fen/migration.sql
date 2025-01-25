/*
  Warnings:

  - You are about to drop the column `boardState` on the `Game` table. All the data in the column will be lost.
  - Added the required column `currentFen` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "boardState",
ADD COLUMN     "currentFen" TEXT NOT NULL;
