/*
  Warnings:

  - Added the required column `moveNumber` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "moveNumber" INTEGER NOT NULL;
