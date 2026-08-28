import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDocument(familyId: string, dto: CreateDocumentDto) {
    return this.prisma.vaultDocument.create({
      data: {
        ...dto,
        familyId,
      },
    });
  }

  async getDocuments(familyId: string) {
    return this.prisma.vaultDocument.findMany({
      where: { familyId },
      orderBy: { uploadDate: 'desc' },
    });
  }

  async getDocumentById(familyId: string, id: string) {
    const doc = await this.prisma.vaultDocument.findFirst({
      where: { id, familyId },
    });

    if (!doc) {
      throw new NotFoundException('Document not found in this family');
    }

    return doc;
  }

  async deleteDocument(familyId: string, id: string) {
    await this.getDocumentById(familyId, id);
    return this.prisma.vaultDocument.delete({
      where: { id },
    });
  }
}
