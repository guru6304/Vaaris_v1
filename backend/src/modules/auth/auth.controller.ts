import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDataDto, TokensOnlyDataDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUserPayload } from '../../common/decorators/current-user.decorator';
import { ApiErrorResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register New User',
    description: 'Registers a new user profile with secure password hashing and returns auth tokens.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully with access and refresh tokens.',
    type: AuthResponseDataDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed (e.g. invalid email format, weak password).',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email is already registered.',
    type: ApiErrorResponseDto,
  })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDataDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticates user credentials and returns JWT access + refresh tokens.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated.',
    type: AuthResponseDataDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials provided.',
    type: ApiErrorResponseDto,
  })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDataDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh Access Token',
    description: 'Exchanges a valid refresh token for a fresh access token and rotated refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed and rotated.',
    type: TokensOnlyDataDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token is expired, invalid, or revoked.',
    type: ApiErrorResponseDto,
  })
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<TokensOnlyDataDto> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'User Logout',
    description: 'Revokes the active refresh token session for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out and session revoked.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / invalid access token.',
    type: ApiErrorResponseDto,
  })
  async logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get Current Authenticated User',
    description: 'Returns profile details and active family memberships for the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized request.',
    type: ApiErrorResponseDto,
  })
  async getMe(@CurrentUser() user: AuthenticatedUserPayload) {
    return this.authService.getMe(user.id);
  }
}
