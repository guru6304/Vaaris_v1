import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { FamilyRole } from '@prisma/client';

export class AddFamilyMemberDto {
  @ApiProperty({
    example: 'Ananya Sharma',
    description: 'Full name of the family member',
  })
  @IsString()
  @IsNotEmpty({ message: 'Member name is required' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name: string;

  @ApiProperty({
    example: 'Spouse',
    description: 'Relationship to the primary account holder (e.g. Spouse, Son, Daughter, Parent)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Relationship is required' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  relationship: string;

  @ApiProperty({
    enum: FamilyRole,
    example: FamilyRole.DECISION_MAKER,
    description: 'Assigned family role in the continuity governance model',
    required: false,
    default: FamilyRole.DECISION_MAKER,
  })
  @IsOptional()
  @IsEnum(FamilyRole, { message: 'Invalid family role' })
  role?: FamilyRole;

  @ApiProperty({
    example: 'ananya@example.com',
    description: 'Optional contact email address',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address format' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  email?: string;

  @ApiProperty({
    example: '+919876543211',
    description: 'Optional contact phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  phone?: string;

  @ApiProperty({
    example: 38,
    description: 'Optional age of the family member',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Age must be an integer' })
  @Min(0, { message: 'Age cannot be negative' })
  @Max(130, { message: 'Age is invalid' })
  age?: number;

  @ApiProperty({
    example: true,
    description: 'Whether this member is designated as an emergency contact',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isEmergencyContact?: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether this member is the primary emergency contact',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimaryContact?: boolean;

  @ApiProperty({
    example: 'Authorized nominee for HDFC Bank account and Max Life Insurance policy',
    description: 'Optional notes or continuity context',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: '85e0543e-324c-473d-8f92-56e3b5220c32',
    description: 'Optional user ID if this family member is already a registered user',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'userId must be a valid UUID' })
  userId?: string;
}
