import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: '85e0543e-324c-473d-8f92-56e3b5220c32' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Rajesh Sharma' })
  fullName: string;

  @ApiProperty({ example: '+919876543210', required: false, nullable: true })
  phoneNumber?: string | null;

  @ApiProperty({ example: false })
  isEmailVerified: boolean;

  @ApiProperty({ example: false })
  isPhoneVerified: boolean;

  @ApiProperty({ example: '2026-08-28T05:00:00.000Z' })
  createdAt: Date;
}

export class AuthTokensDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Short-lived JWT access token for Bearer authentication',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Long-lived JWT refresh token used to rotate credentials',
  })
  refreshToken: string;

  @ApiProperty({
    example: '15m',
    description: 'Access token expiration timeframe',
  })
  expiresIn: string;
}

export class AuthResponseDataDto {
  @ApiProperty({ type: UserProfileDto })
  user: UserProfileDto;

  @ApiProperty({ type: AuthTokensDto })
  tokens: AuthTokensDto;
}

export class TokensOnlyDataDto {
  @ApiProperty({ type: AuthTokensDto })
  tokens: AuthTokensDto;
}
