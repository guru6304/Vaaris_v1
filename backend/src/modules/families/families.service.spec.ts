import { Test, TestingModule } from '@nestjs/testing';
import { FamiliesService } from './families.service';
import { PrismaService } from '../../prisma/prisma.service';
import { FamilyRole, AccessStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('FamiliesService Unit Tests', () => {
  let familiesService: FamiliesService;
  let prismaService: jest.Mocked<Partial<PrismaService>>;

  const mockFamily = {
    id: 'family-uuid-1',
    name: 'Sharma Family',
    createdById: 'user-uuid-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMember = {
    id: 'member-uuid-1',
    familyId: 'family-uuid-1',
    userId: 'user-uuid-1',
    name: 'Rajesh Sharma',
    relationship: 'Self',
    age: 40,
    role: FamilyRole.PRIMARY_ADMIN,
    phone: null,
    email: null,
    isEmergencyContact: true,
    isPrimaryContact: true,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAccess = {
    id: 'access-uuid-1',
    familyId: 'family-uuid-1',
    userId: 'user-uuid-1',
    role: FamilyRole.PRIMARY_ADMIN,
    status: AccessStatus.ACTIVE,
    grantedAt: new Date(),
    revokedAt: null,
  };

  beforeEach(async () => {
    prismaService = {
      $transaction: jest.fn().mockImplementation(async (callback) => {
        const tx = {
          family: {
            create: jest.fn().mockResolvedValue(mockFamily),
          },
          familyMember: {
            create: jest.fn().mockResolvedValue(mockMember),
          },
          familyAccess: {
            create: jest.fn().mockResolvedValue(mockAccess),
          },
        };
        return callback(tx);
      }),
      familyAccess: {
        findMany: jest.fn().mockResolvedValue([
          {
            ...mockAccess,
            family: {
              ...mockFamily,
              _count: { members: 1, accessList: 1 },
            },
          },
        ]),
        findUnique: jest.fn(),
      } as any,
      family: {
        findUnique: jest.fn(),
        update: jest.fn(),
      } as any,
      familyMember: {
        findMany: jest.fn().mockResolvedValue([mockMember]),
        create: jest.fn(),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FamiliesService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    familiesService = module.get<FamiliesService>(FamiliesService);
  });

  describe('createFamily', () => {
    it('should atomically create family, primary member, and primary admin access in a transaction', async () => {
      const result = await familiesService.createFamily('user-uuid-1', 'Rajesh Sharma', {
        name: 'Sharma Family',
      });

      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'family-uuid-1');
      expect(result).toHaveProperty('myRole', FamilyRole.PRIMARY_ADMIN);
      expect(result).toHaveProperty('myStatus', AccessStatus.ACTIVE);
    });
  });

  describe('getUserFamilies', () => {
    it('should return list of families where user has active access', async () => {
      const families = await familiesService.getUserFamilies('user-uuid-1');

      expect(families).toHaveLength(1);
      expect(families[0]).toHaveProperty('familyId', 'family-uuid-1');
      expect(families[0]).toHaveProperty('isCreator', true);
    });
  });

  describe('getFamilyById', () => {
    it('should throw NotFoundException if family does not exist or user has no access', async () => {
      (prismaService.family.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        familiesService.getFamilyById('unknown-family-id', 'user-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
