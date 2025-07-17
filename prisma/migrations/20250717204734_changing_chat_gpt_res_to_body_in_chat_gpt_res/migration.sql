/*
  Warnings:

  - You are about to drop the column `chatGPTRes` on the `ChatGPTRes` table. All the data in the column will be lost.
  - Added the required column `body` to the `ChatGPTRes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatGPTRes" DROP COLUMN "chatGPTRes",
ADD COLUMN     "body" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT NOT NULL;
