/*
  Warnings:

  - Added the required column `blackPlayerTimeConsumed` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whitePlayerTimeConsumed` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "blackPlayerTimeConsumed" INTEGER NOT NULL,
ADD COLUMN     "whitePlayerTimeConsumed" INTEGER NOT NULL;
