/*
  Warnings:

  - You are about to drop the column `expeditionId` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `subdomain` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the `Expedition` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expeditionName` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_expeditionId_fkey";

-- DropIndex
DROP INDEX "Tenant_subdomain_key";

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "expeditionId",
ADD COLUMN     "expeditionName" TEXT NOT NULL,
ADD COLUMN     "expeditionType" TEXT;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "subdomain";

-- DropTable
DROP TABLE "Expedition";
