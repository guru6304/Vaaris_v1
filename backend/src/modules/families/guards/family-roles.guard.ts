import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { FamilyRole, AccessStatus } from '@prisma/client';

// Role hierarchy rank where higher number represents greater administrative privileges
const ROLE_HIERARCHY: Record<FamilyRole, number> = {
  [FamilyRole.PRIMARY_ADMIN]: 40,
  [FamilyRole.DECISION_MAKER]: 30,
  [FamilyRole.CONTINGENT_MEMBER]: 20,
  [FamilyRole.VIEWER]: 10,
  [FamilyRole.EMERGENCY_CONTACT]: 5,
};

@Injectable()
export class FamilyRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('Authentication required to access family resources');
    }

    // Extract familyId from route params or body
    const familyId =
      request.params?.familyId ||
      request.params?.id ||
      request.body?.familyId ||
      request.query?.familyId;

    if (!familyId) {
      throw new BadRequestException('Family ID parameter is missing from request');
    }

    // Server-side database verification of FamilyAccess
    const access = await this.prisma.familyAccess.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId: user.id,
        },
      },
    });

    // Cross-family security isolation: Strictly reject if no access or not active
    if (!access || access.status !== AccessStatus.ACTIVE) {
      throw new ForbiddenException('Access denied: You do not have active access to this family');
    }

    // Attach verified familyAccess context to request object for downstream controllers
    request.familyAccess = access;

    // Check required role permissions
    const requiredRoles = this.reflector.getAllAndOverride<FamilyRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // PRIMARY_ADMIN has universal family permissions
    if (access.role === FamilyRole.PRIMARY_ADMIN) {
      return true;
    }

    // Check if user's role is explicitly allowed or has sufficient hierarchy level
    const userRoleRank = ROLE_HIERARCHY[access.role] || 0;
    const isExplicitlyAllowed = requiredRoles.includes(access.role);
    const minRequiredRank = Math.min(...requiredRoles.map((r) => ROLE_HIERARCHY[r] || 0));

    if (!isExplicitlyAllowed && userRoleRank < minRequiredRank) {
      throw new ForbiddenException(
        `Access denied: Your role (${access.role}) does not have permission for this action in this family`,
      );
    }

    return true;
  }
}
