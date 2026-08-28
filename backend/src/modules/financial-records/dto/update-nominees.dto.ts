import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NomineeItemDto } from './create-financial-record.dto';

export class UpdateNomineesDto {
  @ApiProperty({ example: 'Verified', description: 'Updated nominee status (Verified, Needs Review, Action Required, Not Added)' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ type: [NomineeItemDto], description: 'List of nominees allocated to this asset' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NomineeItemDto)
  nominees: NomineeItemDto[];
}
