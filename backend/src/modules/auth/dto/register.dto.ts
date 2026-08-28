import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address (must be valid and unique)',
  })
  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  email: string;

  @ApiProperty({
    example: 'SecureP@ssw0rd123',
    description: 'User password (minimum 8 characters with letters & numbers)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({
    example: 'Rajesh Sharma',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  fullName: string;

  @ApiProperty({
    example: '+919876543210',
    description: 'Optional contact phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  phoneNumber?: string;
}
