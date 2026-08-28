import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class NomineeItemDto {
  @ApiProperty({ example: 'Ananya Sharma' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Spouse' })
  @IsString()
  @IsNotEmpty()
  relationship: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  sharePercentage: number;
}

export class CreateFinancialRecordDto {
  @ApiProperty({ example: 'HDFC Savings Account' })
  @IsString()
  @IsNotEmpty({ message: 'Record name is required' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name: string;

  @ApiProperty({ example: 'bank_accounts' })
  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @ApiProperty({ example: 'HDFC Bank' })
  @IsString()
  @IsNotEmpty({ message: 'Institution is required' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  institution: string;

  @ApiProperty({ example: '•••• 4821', required: false })
  @IsOptional()
  @IsString()
  accountNumberMasked?: string;

  @ApiProperty({ example: 450000, description: 'Asset value or liability balance' })
  @IsNumber()
  value: number;

  @ApiProperty({ example: false, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isInsurance?: boolean;

  @ApiProperty({ example: 10000000, required: false })
  @IsOptional()
  @IsNumber()
  insuranceCoverage?: number;

  @ApiProperty({ example: 'Verified', required: false, default: 'Not Added' })
  @IsOptional()
  @IsString()
  nomineeStatus?: string;

  @ApiProperty({ example: 'User provided', required: false, default: 'User provided' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ example: 'Primary salary account', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'Confirm joint holder status', required: false })
  @IsOptional()
  @IsString()
  actionRequired?: string;

  @ApiProperty({ type: [NomineeItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NomineeItemDto)
  nominees?: NomineeItemDto[];
}
