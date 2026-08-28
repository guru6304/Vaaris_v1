import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { AddFamilyMemberDto } from './dto/add-family-member.dto';
import { GrantFamilyAccessDto } from './dto/grant-family-access.dto';
import { FamilyRole, AccessStatus } from '@prisma/client';

@Injectable()
export class FamiliesService {
  private readonly logger = new Logger(FamiliesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Atomically creates a new Family workspace, its primary member profile, and creator PRIMARY_ADMIN access.
   * Everything succeeds or everything rolls back.
   */
  async createFamily(
    userId: string,
    userFullName: string,
    dto: CreateFamilyDto,
  ) {
    const familyName = dto.name.trim();

    return this.prisma.$transaction(async (tx) => {
      // 1. Create the Family
      const family = await tx.family.create({
        data: {
          name: familyName,
          createdById: userId,
        },
      });

      // 2. Create the creator's FamilyMember profile
      const primaryMember = await tx.familyMember.create({
        data: {
          familyId: family.id,
          userId: userId,
          name: userFullName || 'Primary Account Holder',
          relationship: 'Self',
          role: FamilyRole.PRIMARY_ADMIN,
          isPrimaryContact: true,
          isEmergencyContact: true,
        },
      });

      // 3. Create the creator's FamilyAccess record
      const access = await tx.familyAccess.create({
        data: {
          familyId: family.id,
          userId: userId,
          role: FamilyRole.PRIMARY_ADMIN,
          status: AccessStatus.ACTIVE,
        },
      });

      this.logger.log(`Family "${familyName}" (${family.id}) created atomically by user ${userId}.`);

      return {
        id: family.id,
        name: family.name,
        createdById: family.createdById,
        createdAt: family.createdAt,
        updatedAt: family.updatedAt,
        myRole: access.role,
        myStatus: access.status,
        primaryMemberId: primaryMember.id,
      };
    });
  }

  /**
   * Retrieves all family workspaces where the user has active access
   */
  async getUserFamilies(userId: string) {
    const accesses = await this.prisma.familyAccess.findMany({
      where: {
        userId,
        status: AccessStatus.ACTIVE,
      },
      include: {
        family: {
          include: {
            _count: {
              select: {
                members: true,
                accessList: true,
              },
            },
          },
        },
      },
      orderBy: { grantedAt: 'desc' },
    });

    return accesses.map((access) => ({
      familyId: access.family.id,
      name: access.family.name,
      createdById: access.family.createdById,
      isCreator: access.family.createdById === userId,
      role: access.role,
      status: access.status,
      memberCount: access.family._count.members,
      accessCount: access.family._count.accessList,
      grantedAt: access.grantedAt,
      createdAt: access.family.createdAt,
    }));
  }

  /**
   * Retrieves full details of a family (members + accesses) for an authorized user
   */
  async getFamilyById(familyId: string, userId: string) {
    const family = await this.prisma.family.findUnique({
      where: { id: familyId },
      include: {
        members: {
          orderBy: { createdAt: 'asc' },
        },
        accessList: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
          orderBy: { grantedAt: 'asc' },
        },
      },
    });

    if (!family) {
      throw new NotFoundException('Family not found');
    }

    const userAccess = family.accessList.find((a) => a.userId === userId && a.status === AccessStatus.ACTIVE);
    if (!userAccess) {
      throw new NotFoundException('Family not found or access revoked');
    }

    return {
      id: family.id,
      name: family.name,
      createdById: family.createdById,
      createdAt: family.createdAt,
      updatedAt: family.updatedAt,
      myRole: userAccess.role,
      members: family.members,
      accessList: family.accessList.map((a) => ({
        id: a.id,
        userId: a.userId,
        role: a.role,
        status: a.status,
        grantedAt: a.grantedAt,
        user: a.user,
      })),
    };
  }

  /**
   * Updates metadata for a family workspace
   */
  async updateFamily(familyId: string, dto: UpdateFamilyDto) {
    const updated = await this.prisma.family.update({
      where: { id: familyId },
      data: {
        name: dto.name.trim(),
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      updatedAt: updated.updatedAt,
    };
  }

  /**
   * Adds a family member profile within the family boundary
   */
  async addMember(familyId: string, dto: AddFamilyMemberDto) {
    // If a userId is passed, verify user exists
    if (dto.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
      if (!user) {
        throw new NotFoundException('User associated with userId not found');
      }
    }

    const member = await this.prisma.familyMember.create({
      data: {
        familyId,
        name: dto.name.trim(),
        relationship: dto.relationship.trim(),
        role: dto.role || FamilyRole.DECISION_MAKER,
        email: dto.email?.trim().toLowerCase() || null,
        phone: dto.phone?.trim() || null,
        age: dto.age ?? null,
        isEmergencyContact: dto.isEmergencyContact ?? false,
        isPrimaryContact: dto.isPrimaryContact ?? false,
        notes: dto.notes?.trim() || null,
        userId: dto.userId || null,
      },
    });

    return member;
  }

  /**
   * Lists all members belonging to a family
   */
  async getMembers(familyId: string) {
    return this.prisma.familyMember.findMany({
      where: { familyId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Grants or updates a user's access to a family workspace
   */
  async grantAccess(familyId: string, dto: GrantFamilyAccessDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User with the specified ID was not found');
    }

    const access = await this.prisma.familyAccess.upsert({
      where: {
        familyId_userId: {
          familyId,
          userId: dto.userId,
        },
      },
      create: {
        familyId,
        userId: dto.userId,
        role: dto.role,
        status: dto.status || AccessStatus.ACTIVE,
      },
      update: {
        role: dto.role,
        status: dto.status || AccessStatus.ACTIVE,
        revokedAt: dto.status === AccessStatus.REVOKED ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return {
      id: access.id,
      familyId: access.familyId,
      userId: access.userId,
      role: access.role,
      status: access.status,
      grantedAt: access.grantedAt,
      user: access.user,
    };
  }

  /**
   * Lists all access grants for a family
   */
  async getAccessList(familyId: string) {
    return this.prisma.familyAccess.findMany({
      where: { familyId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { grantedAt: 'asc' },
    });
  }
}
