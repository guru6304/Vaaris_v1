import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateContinuityPlanDto } from './dto/update-continuity-plan.dto';
import { CreateEmergencyCaseDto } from './dto/create-emergency-case.dto';

@Injectable()
export class ContinuityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or initialize the family continuity plan
   */
  async getContinuityPlan(familyId: string) {
    let plan = await this.prisma.continuityPlan.findUnique({
      where: { familyId },
    });

    if (!plan) {
      plan = await this.prisma.continuityPlan.create({
        data: {
          familyId,
          completionPercentage: 80,
          emergencyContacts: {
            primary: { name: 'Ananya Sharma', role: 'Spouse & Nominee', phone: '+91 98765 43211' },
            secondary: { name: 'Vikram Sharma', role: 'Brother / Trustee', phone: '+91 98765 43212' },
            ca: { name: 'R. K. Agrawal & Co.', firm: 'Chartered Accountants', phone: '+91 98111 22334' },
          },
          responsibilities: {
            immediateFinances: 'Ananya Sharma (Spouse)',
            coordinateCA: 'Vikram Sharma (Brother)',
            overseeBusiness: 'Ananya Sharma + Family Advisor',
          },
          financialIntents: [
            {
              assetName: 'HDFC Savings & FDs',
              category: 'Banking',
              notes: 'To be utilized for immediate household continuity and children education fund.',
              preferredAllocations: [{ name: 'Ananya Sharma', percentage: 100 }],
            },
            {
              assetName: 'Max Life Term Insurance (₹1.00 Cr)',
              category: 'Insurance',
              notes: 'Primary claim payout to clear outstanding liabilities and secure long-term family index investments.',
              preferredAllocations: [{ name: 'Ananya Sharma', percentage: 100 }],
            },
          ],
          instructions: [
            {
              id: 'ins-1',
              title: 'Immediate Access to Bank Locker',
              text: 'Locker key #44 is stored in the master bedroom safe (code in physical password book). Both Ananya and Vikram are authorized joint operators.',
              priority: 'High',
              targetContact: 'Ananya Sharma',
            },
            {
              id: 'ins-2',
              title: 'Health Insurance Claim Protocol',
              text: 'HDFC ERGO TPA Card is in the top right drawer. Inform insurance desk within 24 hours of hospital admission.',
              priority: 'High',
              targetContact: 'Vikram Sharma',
            },
          ],
          emergencyAccessTiers: [
            {
              contactName: 'Ananya Sharma',
              relationship: 'Spouse',
              accessLevel: 'Full Emergency Access',
              permissions: ['View all assets', 'Access Vault documents', 'Initiate claim guidance'],
              restrictionNotice: 'Activated instantly upon biometric or 2-factor OTP verification.',
            },
            {
              contactName: 'Vikram Sharma',
              relationship: 'Brother',
              accessLevel: 'Continuity Trustee',
              permissions: ['View business assets', 'Access tax filings & CA records'],
              restrictionNotice: 'Requires primary contact confirmation or 48-hour inactivity fail-safe.',
            },
          ],
        },
      });
    }

    return plan;
  }

  /**
   * Update the family continuity plan
   */
  async updateContinuityPlan(familyId: string, dto: UpdateContinuityPlanDto) {
    return this.prisma.continuityPlan.upsert({
      where: { familyId },
      create: {
        familyId,
        completionPercentage: dto.completionPercentage ?? 80,
        emergencyContacts: dto.emergencyContacts || undefined,
        responsibilities: dto.responsibilities || undefined,
        financialIntents: dto.financialIntents || undefined,
        instructions: dto.instructions || undefined,
        emergencyAccessTiers: dto.emergencyAccessTiers || undefined,
      },
      update: {
        completionPercentage: dto.completionPercentage,
        emergencyContacts: dto.emergencyContacts,
        responsibilities: dto.responsibilities,
        financialIntents: dto.financialIntents,
        instructions: dto.instructions,
        emergencyAccessTiers: dto.emergencyAccessTiers,
      },
    });
  }

  /**
   * List all emergency cases for a family
   */
  async getEmergencyCases(familyId: string) {
    const cases = await this.prisma.emergencyCase.findMany({
      where: { familyId },
      include: { claims: true },
      orderBy: { dateReported: 'desc' },
    });

    return cases.map((c) => ({
      ...c,
      potentialClaimsCount: c.claims.length,
      inProgressCount: c.claims.filter((cl) => cl.status !== 'Payout Completed').length,
      completedCount: c.claims.filter((cl) => cl.status === 'Payout Completed').length,
      actionRequiredCount: c.claims.filter((cl) => cl.status === 'Missing Document').length,
    }));
  }

  /**
   * Create an emergency case and auto-generate claims from family financial records
   */
  async createEmergencyCase(familyId: string, dto: CreateEmergencyCaseDto) {
    const assets = await this.prisma.financialRecord.findMany({
      where: { familyId },
    });

    const emergencyCase = await this.prisma.emergencyCase.create({
      data: {
        familyId,
        deceasedName: dto.deceasedName.trim(),
        relationship: dto.relationship.trim(),
        knownAssetsValue: dto.knownAssetsValue || assets.reduce((sum, a) => sum + (a.value > 0 ? a.value : 0), 0),
        status: 'Active',
        milestones: [
          { id: 1, title: 'Case Registration & Scope', status: 'Complete', detail: 'Emergency record initiated with verified family members.' },
          { id: 2, title: 'Document & Certificate Verification', status: 'In Progress', detail: 'Death certificate and legal heir documents pending verification.' },
          { id: 3, title: 'Claims Submission to Institutions', status: 'Pending', detail: 'Submission to banking and insurance providers.' },
          { id: 4, title: 'Asset Settlement & Transfer', status: 'Pending', detail: 'Direct payout and asset re-registration to legal nominees.' },
        ],
      },
    });

    // Create initial claim templates for insurance / high-value assets
    const insuranceAsset = assets.find((a) => a.isInsurance) || assets[0];
    if (insuranceAsset) {
      await this.prisma.claim.create({
        data: {
          caseId: emergencyCase.id,
          familyId,
          institution: insuranceAsset.institution,
          assetType: insuranceAsset.category,
          assetName: insuranceAsset.name,
          claimantName: 'Ananya Sharma (Nominee)',
          estimatedAmount: insuranceAsset.insuranceCoverage || insuranceAsset.value || 10000000,
          isInsurance: insuranceAsset.isInsurance,
          status: 'Documents Submitted',
          progressPercentage: 45,
          nextStep: 'Submit attested original death certificate copy to insurer branch',
          steps: [
            { id: 'st-1', stepNumber: 1, title: 'Death Intimation to Insurer', status: 'Complete', notes: 'Intimated online via portal reference #INT-88491' },
            { id: 'st-2', stepNumber: 2, title: 'Claim Forms & KYC Verification', status: 'Complete', notes: 'Form A and Form B submitted with PAN & Aadhaar' },
            { id: 'st-3', stepNumber: 3, title: 'Physical Certificate Submission', status: 'Action Required', requiredDocument: 'Original Death Certificate' },
            { id: 'st-4', stepNumber: 4, title: 'Internal Settlement Assessment', status: 'Pending' },
            { id: 'st-5', stepNumber: 5, title: 'Direct Bank Account Payout', status: 'Pending' },
          ],
          activityLog: [
            { timestamp: 'Today, 10:30 AM', author: 'VAARIS Claim Engine', message: 'Claim checklist initialized from catalogued policy documents.' },
          ],
        },
      });
    }

    return emergencyCase;
  }

  /**
   * List claims for a family
   */
  async getClaims(familyId: string) {
    return this.prisma.claim.findMany({
      where: { familyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Complete a claim workflow step
   */
  async completeClaimStep(familyId: string, claimId: string, stepId: string) {
    const claim = await this.prisma.claim.findFirst({
      where: { id: claimId, familyId },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found in this family');
    }

    const steps = (claim.steps as any[]) || [];
    const updatedSteps = steps.map((s) => (s.id === stepId ? { ...s, status: 'Complete' } : s));
    const completedCount = updatedSteps.filter((s) => s.status === 'Complete').length;
    const progressPercentage = Math.round((completedCount / Math.max(1, updatedSteps.length)) * 100);

    return this.prisma.claim.update({
      where: { id: claimId },
      data: {
        steps: updatedSteps,
        progressPercentage,
        status: progressPercentage === 100 ? 'Payout Completed' : 'Information Review',
      },
    });
  }
}
