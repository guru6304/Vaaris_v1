import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Max Life Insurance Policy Schedule' })
  @IsString()
  @IsNotEmpty({ message: 'Document name is required' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name: string;

  @ApiProperty({ example: 'Insurance' })
  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @ApiProperty({ example: '85e0543e-324c-473d-8f92-56e3b5220c32', required: false })
  @IsOptional()
  @IsUUID('4')
  linkedAssetId?: string;

  @ApiProperty({ example: 'Max Life Term Plan (₹1 Cr)', required: false })
  @IsOptional()
  @IsString()
  linkedAssetName?: string;

  @ApiProperty({ example: 2450000, description: 'File size in bytes', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  fileSizeBytes?: number;

  @ApiProperty({ example: 'Document Processed', required: false, default: 'Document Processed' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: { policyNumber: 'ML-99824', nominee: 'Ananya Sharma' }, required: false })
  @IsOptional()
  extractedData?: Record<string, any>;
}
