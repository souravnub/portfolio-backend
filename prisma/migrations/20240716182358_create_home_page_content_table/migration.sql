-- CreateTable
CREATE TABLE "HomePageContent" (
    "id" SERIAL NOT NULL,
    "mainImageUrl" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "portfolio_slogan" TEXT NOT NULL,
    "portfolio_description" TEXT NOT NULL,

    CONSTRAINT "HomePageContent_pkey" PRIMARY KEY ("id")
);
