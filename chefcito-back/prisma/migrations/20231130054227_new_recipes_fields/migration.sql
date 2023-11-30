/*
  Warnings:

  - You are about to drop the column `cost` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `cost_type` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `buks` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calories` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "cost",
DROP COLUMN "cost_type",
ADD COLUMN     "buks" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "calories" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "protein" DOUBLE PRECISION NOT NULL;
