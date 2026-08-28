-- CreateTable
CREATE TABLE "financial_records" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "accountNumberMasked" TEXT,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isInsurance" BOOLEAN NOT NULL DEFAULT false,
    "insuranceCoverage" DOUBLE PRECISION,
    "nomineeStatus" TEXT NOT NULL DEFAULT 'Not Added',
    "source" TEXT NOT NULL DEFAULT 'User provided',
    "notes" TEXT,
    "actionRequired" TEXT,
    "lastReviewedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nominees" (
    "id" TEXT NOT NULL,
    "financialRecordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "sharePercentage" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nominees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_documents" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "linkedAssetId" TEXT,
    "linkedAssetName" TEXT,
    "fileSizeBytes" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Document Processed',
    "storagePath" TEXT,
    "extractedData" JSONB,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vault_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "continuity_plans" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "emergencyContacts" JSONB,
    "responsibilities" JSONB,
    "financialIntents" JSONB,
    "instructions" JSONB,
    "emergencyAccessTiers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "continuity_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_cases" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "deceasedName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "dateReported" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "knownAssetsValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "milestones" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "claimantName" TEXT NOT NULL,
    "estimatedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isInsurance" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Documents Submitted',
    "progressPercentage" INTEGER NOT NULL DEFAULT 20,
    "nextStep" TEXT NOT NULL,
    "steps" JSONB,
    "missingDocumentNotice" JSONB,
    "assignedProfessionalId" TEXT,
    "activityLog" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "financial_records_familyId_idx" ON "financial_records"("familyId");

-- CreateIndex
CREATE INDEX "nominees_financialRecordId_idx" ON "nominees"("financialRecordId");

-- CreateIndex
CREATE INDEX "vault_documents_familyId_idx" ON "vault_documents"("familyId");

-- CreateIndex
CREATE UNIQUE INDEX "continuity_plans_familyId_key" ON "continuity_plans"("familyId");

-- CreateIndex
CREATE INDEX "emergency_cases_familyId_idx" ON "emergency_cases"("familyId");

-- CreateIndex
CREATE INDEX "claims_caseId_idx" ON "claims"("caseId");

-- CreateIndex
CREATE INDEX "claims_familyId_idx" ON "claims"("familyId");

-- AddForeignKey
ALTER TABLE "financial_records" ADD CONSTRAINT "financial_records_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominees" ADD CONSTRAINT "nominees_financialRecordId_fkey" FOREIGN KEY ("financialRecordId") REFERENCES "financial_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_documents" ADD CONSTRAINT "vault_documents_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_documents" ADD CONSTRAINT "vault_documents_linkedAssetId_fkey" FOREIGN KEY ("linkedAssetId") REFERENCES "financial_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "continuity_plans" ADD CONSTRAINT "continuity_plans_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_cases" ADD CONSTRAINT "emergency_cases_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "emergency_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
