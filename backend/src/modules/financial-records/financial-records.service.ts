import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFinancialRecordDto } from './dto/create-financial-record.dto';
import { UpdateFinancialRecordDto } from './dto/update-financial-record.dto';
import { UpdateNomineesDto } from './dto/update-nominees.dto';

@Injectable()
export class FinancialRecordsService {
  private readonly logger = new Logger(FinancialRecordsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a financial record (asset or liability) inside a family boundary
   */
  async createRecord(familyId: string, dto: CreateFinancialRecordDto) {
    const { nominees, ...recordData } = dto;

    return this.prisma.financialRecord.create({
      data: {
        ...recordData,
        familyId,
        nominees: nominees && nominees.length > 0
          ? {
              create: nominees.map((n) => ({
                name: n.name.trim(),
                relationship: n.relationship.trim(),
                sharePercentage: n.sharePercentage,
                verifiedAt: new Date(),
              })),
            }
          : undefined,
      },
      include: {
        nominees: true,
        linkedDocuments: true,
      },
    });
  }

  /**
   * List all financial records for a family with nominee and document counts
   */
  async getRecords(familyId: string) {
    const records = await this.prisma.financialRecord.findMany({
      where: { familyId },
      include: {
        nominees: true,
        linkedDocuments: {
          select: { id: true, name: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((r) => ({
      ...r,
      documentsCount: r.linkedDocuments.length,
    }));
  }

  /**
   * Get a single financial record by ID within family boundary
   */
  async getRecordById(familyId: string, id: string) {
    const record = await this.prisma.financialRecord.findFirst({
      where: { id, familyId },
      include: {
        nominees: true,
        linkedDocuments: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Financial record not found in this family');
    }

    return {
      ...record,
      documentsCount: record.linkedDocuments.length,
    };
  }

  /**
   * Update a financial record
   */
  async updateRecord(familyId: string, id: string, dto: UpdateFinancialRecordDto) {
    await this.getRecordById(familyId, id);
    const { nominees, ...recordData } = dto;

    return this.prisma.financialRecord.update({
      where: { id },
      data: {
        ...recordData,
        lastReviewedDate: new Date(),
        nominees: nominees
          ? {
              deleteMany: {},
              create: nominees.map((n) => ({
                name: n.name.trim(),
                relationship: n.relationship.trim(),
                sharePercentage: n.sharePercentage,
                verifiedAt: new Date(),
              })),
            }
          : undefined,
      },
      include: {
        nominees: true,
        linkedDocuments: true,
      },
    });
  }

  /**
   * Delete / archive a financial record
   */
  async deleteRecord(familyId: string, id: string) {
    await this.getRecordById(familyId, id);
    return this.prisma.financialRecord.delete({
      where: { id },
    });
  }

  /**
   * Update nominees and nominee status for a financial record
   */
  async updateNominees(familyId: string, id: string, dto: UpdateNomineesDto) {
    await this.getRecordById(familyId, id);

    return this.prisma.financialRecord.update({
      where: { id },
      data: {
        nomineeStatus: dto.status,
        lastReviewedDate: new Date(),
        source: dto.status === 'Verified' ? 'Document verified' : 'User provided',
        nominees: {
          deleteMany: {},
          create: dto.nominees.map((n) => ({
            name: n.name.trim(),
            relationship: n.relationship.trim(),
            sharePercentage: n.sharePercentage,
            verifiedAt: dto.status === 'Verified' ? new Date() : null,
          })),
        },
      },
      include: {
        nominees: true,
      },
    });
  }
}
