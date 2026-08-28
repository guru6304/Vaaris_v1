import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateFamilyDto {
  @ApiProperty({
    example: 'Sharma Family Trust',
    description: 'Updated name for the family workspace',
  })
  @IsString()
  @IsNotEmpty({ message: 'Family name cannot be empty' })
  @MinLength(2, { message: 'Family name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Family name cannot exceed 100 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name: string;
}
