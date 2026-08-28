import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService, SafeUser } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDataDto, TokensOnlyDataDto } from './dto/auth-response.dto';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 10;
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.accessSecret =
      this.configService.get<string>('jwt.accessSecret') ||
      'dev-jwt-access-secret-key-32-chars-long';
    this.refreshSecret =
      this.configService.get<string>('jwt.refreshSecret') ||
      'dev-jwt-refresh-secret-key-32-chars-long';
    this.accessExpiresIn =
      this.configService.get<string>('jwt.accessExpiresIn') || '15m';
    this.refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') || '7d';
  }

  /**
   * Registers a new user, hashes their password, and issues initial auth tokens
   */
  async register(dto: RegisterDto): Promise<AuthResponseDataDto> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictException('A user with this email address already exists');
    }

    // Securely hash password
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);

    // Create user
    const user = await this.usersService.create({
      email: normalizedEmail,
      fullName: dto.fullName.trim(),
      passwordHash,
      phoneNumber: dto.phoneNumber?.trim() || null,
    });

    // Generate tokens and store hashed refresh token
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateHashedRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.usersService.sanitizeUser(user) as any,
      tokens,
    };
  }

  /**
   * Logs in an existing user with email and password
   */
  async login(dto: LoginDto): Promise<AuthResponseDataDto> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user || !user.passwordHash) {
      // Generic invalid credentials message to prevent account enumeration
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate new tokens & update hashed refresh token in database
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateHashedRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.usersService.sanitizeUser(user) as any,
      tokens,
    };
  }

  /**
   * Rotates access and refresh tokens using a valid refresh token
   */
  async refreshToken(rawRefreshToken: string): Promise<TokensOnlyDataDto> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(rawRefreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!payload || payload.type !== 'refresh' || !payload.sub) {
      throw new UnauthorizedException('Invalid refresh token type');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Refresh token has been revoked or is invalid');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      rawRefreshToken,
      user.hashedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      // Possible token reuse attack — revoke token immediately for safety
      await this.usersService.updateHashedRefreshToken(user.id, null);
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    // Token rotation: Issue new access & refresh tokens
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateHashedRefreshToken(user.id, tokens.refreshToken);

    return { tokens };
  }

  /**
   * Logs out a user by invalidating their stored refresh token
   */
  async logout(userId: string): Promise<{ success: boolean; message: string }> {
    await this.usersService.updateHashedRefreshToken(userId, null);
    return {
      success: true,
      message: 'Successfully logged out',
    };
  }

  /**
   * Retrieves profile details and active family memberships for the current user
   */
  async getMe(userId: string): Promise<SafeUser & { families: any[] }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        familyAccesses: {
          where: { status: 'ACTIVE' },
          include: {
            family: {
              select: {
                id: true,
                name: true,
                createdById: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User account not found');
    }

    const safeUser = this.usersService.sanitizeUser(user);
    const families = user.familyAccesses.map((fa) => ({
      familyId: fa.family.id,
      familyName: fa.family.name,
      role: fa.role,
      status: fa.status,
      grantedAt: fa.grantedAt,
      isCreator: fa.family.createdById === user.id,
    }));

    return {
      ...safeUser,
      families,
    };
  }

  /**
   * Helper to generate signed access and refresh tokens
   */
  private async generateTokens(userId: string, email: string) {
    const accessPayload: JwtPayload = { sub: userId, email, type: 'access' };
    const refreshPayload: JwtPayload = { sub: userId, email, type: 'refresh' };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn as any,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessExpiresIn,
    };
  }

  /**
   * Helper to hash and store refresh token in database
   */
  private async updateHashedRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, this.saltRounds);
    await this.usersService.updateHashedRefreshToken(userId, hashedRefreshToken);
  }
}
