import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEmergencyCaseDto {
  @ApiProperty({ example: 'Suresh Sharma' })
  @IsString()
  @IsNotEmpty({ message: 'Deceased name is required' })
  deceasedName: string;

  @ApiProperty({ example: 'Father' })
  @IsString()
  @IsNotEmpty({ message: 'Relationship is required' })
  relationship: string;

  @ApiProperty({ example: 4500000, required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  knownAssetsValue?: number;
}
