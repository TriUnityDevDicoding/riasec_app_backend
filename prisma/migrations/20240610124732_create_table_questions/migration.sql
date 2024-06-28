-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional');

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);
