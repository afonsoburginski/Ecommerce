/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_transactionId_fkey";

-- DropIndex
DROP INDEX "Order_transactionId_key";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "transactionId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Transaction";
