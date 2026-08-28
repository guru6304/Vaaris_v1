import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFamilyDto {
  @ApiProperty({
    example: 'Sharma Family Estate',
    description: 'The display name of the family continuity workspace',
  })
  @IsString()
  @IsNotEmpty({ message: 'Family name is required' })
  @MinLength(2, { message: 'Family name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Family name cannot exceed 100 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name: string;
}
