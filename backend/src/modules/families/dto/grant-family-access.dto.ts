import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { FamilyRole, AccessStatus } from '@prisma/client';

export class GrantFamilyAccessDto {
  @ApiProperty({
    example: '85e0543e-324c-473d-8f92-56e3b5220c32',
    description: 'The UUID of the registered user receiving access to this family',
  })
  @IsUUID('4', { message: 'userId must be a valid UUID' })
  @IsNotEmpty({ message: 'userId is required' })
  userId: string;

  @ApiProperty({
    enum: FamilyRole,
    example: FamilyRole.DECISION_MAKER,
    description: 'Security role granted in this family workspace',
    default: FamilyRole.VIEWER,
  })
  @IsEnum(FamilyRole, { message: 'Invalid family role' })
  role: FamilyRole;

  @ApiProperty({
    enum: AccessStatus,
    example: AccessStatus.ACTIVE,
    description: 'Access activation status',
    required: false,
    default: AccessStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(AccessStatus, { message: 'Invalid access status' })
  status?: AccessStatus;
}
