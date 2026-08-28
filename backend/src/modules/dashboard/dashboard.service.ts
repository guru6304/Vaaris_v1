import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Derive live real-time dashboard metrics, readiness score, and attention items for a family
   */
  async getDashboardSummary(familyId: string) {
    const [family, members, records, documents, plan] = await Promise.all([
      this.prisma.family.findUnique({
        where: { id: familyId },
      }),
      this.prisma.familyMember.findMany({
        where: { familyId },
      }),
      this.prisma.financialRecord.findMany({
        where: { familyId },
        include: { nominees: true },
      }),
      this.prisma.vaultDocument.findMany({
        where: { familyId },
      }),
      this.prisma.continuityPlan.findUnique({
        where: { familyId },
      }),
    ]);

    // Financial Metrics Calculation
    const totalAssetValue = records
      .filter((r) => !r.isInsurance && r.category !== 'loans_liabilities' && r.value > 0)
      .reduce((sum, r) => sum + r.value, 0);

    const totalLiabilities = records
      .filter((r) => r.category === 'loans_liabilities' || r.value < 0)
      .reduce((sum, r) => sum + Math.abs(r.value), 0);

    const netWorth = Math.max(0, totalAssetValue - totalLiabilities);

    const totalInsuranceCoverage = records
      .filter((r) => r.isInsurance && (r.insuranceCoverage || 0) > 0)
      .reduce((sum, r) => sum + (r.insuranceCoverage || 0), 0);

    const eligibleAssets = records.filter((r) => r.category !== 'loans_liabilities');
    const verifiedNomineesCount = eligibleAssets.filter((r) => r.nomineeStatus === 'Verified').length;
    const nomineeCoveragePercentage = eligibleAssets.length > 0
      ? Math.round((verifiedNomineesCount / eligibleAssets.length) * 100)
      : 0;

    const organizedAssetsCount = records.filter((r) => r.source !== 'Needs confirmation').length;
    const protectedDocumentsCount = documents.filter((d) => d.status === 'Document Processed').length;

    // Derived Attention Items
    const attentionItems = [];

    // Check unverified nominees
    const unverifiedAssets = records.filter((r) => r.nomineeStatus !== 'Verified' && r.category !== 'loans_liabilities');
    for (const ast of unverifiedAssets.slice(0, 3)) {
      attentionItems.push({
        id: `att-nom-${ast.id}`,
        title: `Nominee Missing for ${ast.name}`,
        category: 'Nominees',
        priority: 'HIGH PRIORITY',
        description: `Verify and allocate beneficiary percentage for ${ast.institution} account.`,
        targetRoute: 'nominees',
        targetId: ast.id,
        points: 8,
        isResolved: false,
      });
    }

    // Check unlinked insurance documents
    const insuranceWithoutDoc = records.filter(
      (r) => r.isInsurance && !documents.some((d) => d.linkedAssetId === r.id),
    );
    for (const ins of insuranceWithoutDoc.slice(0, 2)) {
      attentionItems.push({
        id: `att-doc-${ins.id}`,
        title: `Upload Policy Schedule for ${ins.name}`,
        category: 'Documents',
        priority: 'MEDIUM PRIORITY',
        description: 'Store official insurer document to enable fast claim processing during crisis.',
        targetRoute: 'documents',
        targetId: ins.id,
        points: 6,
        isResolved: false,
      });
    }

    // Check emergency contact
    const hasEmergencyContact = members.some((m) => m.isEmergencyContact);
    if (!hasEmergencyContact) {
      attentionItems.push({
        id: 'att-emg-contact',
        title: 'Designate Primary Emergency Contact',
        category: 'Family',
        priority: 'HIGH PRIORITY',
        description: 'Assign a family member authorized to coordinate emergency actions.',
        targetRoute: 'family',
        points: 10,
        isResolved: false,
      });
    }

    // Readiness Score Computation (Predictable & Transparent)
    let score = 50; // Base baseline
    if (members.length >= 2) score += 10;
    if (records.length >= 3) score += 10;
    if (nomineeCoveragePercentage >= 70) score += 15;
    else if (nomineeCoveragePercentage > 0) score += 8;
    if (documents.length >= 2) score += 10;
    if (plan && plan.completionPercentage >= 70) score += 10;
    if (hasEmergencyContact) score += 5;

    const finalReadinessScore = Math.min(99, Math.max(40, score));

    // Category Breakdowns
    const readinessBreakdown = [
      {
        category: 'Nominee Readiness',
        score: nomineeCoveragePercentage,
        maxScore: 100,
        percentage: nomineeCoveragePercentage,
        description: `${verifiedNomineesCount} of ${eligibleAssets.length} assets have verified nominees on record.`,
      },
      {
        category: 'Assets Organized',
        score: records.length > 0 ? Math.round((organizedAssetsCount / records.length) * 100) : 0,
        maxScore: 100,
        percentage: records.length > 0 ? Math.round((organizedAssetsCount / records.length) * 100) : 0,
        description: `${organizedAssetsCount} assets catalogued with account masks and valuations.`,
      },
      {
        category: 'Document Vault',
        score: documents.length > 0 ? Math.round((protectedDocumentsCount / documents.length) * 100) : 0,
        maxScore: 100,
        percentage: documents.length > 0 ? Math.round((protectedDocumentsCount / documents.length) * 100) : 0,
        description: `${protectedDocumentsCount} policy and identity records stored securely.`,
      },
      {
        category: 'Continuity Plan',
        score: plan ? plan.completionPercentage : 0,
        maxScore: 100,
        percentage: plan ? plan.completionPercentage : 0,
        description: 'Designated responsibilities and emergency access tiers configured.',
      },
    ];

    return {
      familyId,
      familyName: family?.name || 'My Family',
      metrics: {
        totalAssetValue,
        totalLiabilities,
        netWorth,
        totalInsuranceCoverage,
        organizedAssetsCount,
        nomineeCoveragePercentage,
        protectedDocumentsCount,
        readinessScore: finalReadinessScore,
      },
      readinessBreakdown,
      attentionItems,
    };
  }
}
