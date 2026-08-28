import { SetMetadata } from '@nestjs/common';
import { FamilyRole } from '@prisma/client';

export const ROLES_KEY = 'familyRoles';
export const Roles = (...roles: FamilyRole[]) => SetMetadata(ROLES_KEY, roles);
