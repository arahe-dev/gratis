-- CreateEnum
CREATE TYPE "BuilderType" AS ENUM ('student', 'indie_builder', 'early_career_developer', 'open_source_contributor', 'hackathon_team', 'other');

-- CreateEnum
CREATE TYPE "SponsorBudgetRange" AS ENUM ('inr_1000', 'inr_5000', 'inr_25000', 'inr_75000_plus', 'custom');

-- CreateTable
CREATE TABLE "WaitlistSignup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "type" "BuilderType" NOT NULL,
    "currentTool" TEXT,
    "whyInterested" TEXT,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "ipHash" TEXT,
    CONSTRAINT "WaitlistSignup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorLead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "budgetRange" "SponsorBudgetRange" NOT NULL,
    "targetAudience" TEXT,
    "message" TEXT,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "ipHash" TEXT,
    CONSTRAINT "SponsorLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistSignup_email_key" ON "WaitlistSignup"("email");
