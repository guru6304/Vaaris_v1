import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateContinuityPlanDto {
  @ApiProperty({ example: 80, required: false })
  @IsOptional()
  @IsNumber()
  completionPercentage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  emergencyContacts?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  responsibilities?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  financialIntents?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  instructions?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  emergencyAccessTiers?: any[];
}
