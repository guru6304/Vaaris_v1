import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$mockedHashedValue'),
  compare: jest.fn(),
}));

describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;
  let prismaService: jest.Mocked<Partial<PrismaService>>;

  const mockUser = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    fullName: 'Test User',
    passwordHash: '$2b$10$hashedPasswordHere12345678901234567890123456789012345678',
    phoneNumber: '+919876543210',
    hashedRefreshToken: '$2b$10$hashedRefreshTokenHere123456789012345678901234567890123',
    isEmailVerified: false,
    isPhoneVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateHashedRefreshToken: jest.fn(),
      sanitizeUser: jest.fn().mockImplementation((u) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, hashedRefreshToken, ...safe } = u;
        return safe;
      }),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
      verifyAsync: jest.fn(),
    };

    prismaService = {
      user: {
        findUnique: jest.fn(),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: PrismaService, useValue: prismaService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'jwt.accessSecret') return 'test-access-secret-32-chars-long';
              if (key === 'jwt.refreshSecret') return 'test-refresh-secret-32-chars-long';
              if (key === 'jwt.accessExpiresIn') return '15m';
              if (key === 'jwt.refreshExpiresIn') return '7d';
              return null;
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a new user and return tokens with sanitized user', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.register({
        email: 'test@example.com',
        password: 'ValidPassword123!',
        fullName: 'Test User',
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.tokens).toHaveProperty('accessToken');
      expect(result.tokens).toHaveProperty('refreshToken');
      expect((result.user as any).passwordHash).toBeUndefined();
      expect((result.user as any).hashedRefreshToken).toBeUndefined();
    });

    it('should throw ConflictException if user email already exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'ValidPassword123!',
          fullName: 'Test User',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException on non-existent user email', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'unknown@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should successfully authenticate with valid credentials and return tokens', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'CorrectPassword123!',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBe('mocked-jwt-token');
      expect(usersService.updateHashedRefreshToken).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear hashedRefreshToken on logout', async () => {
      const result = await authService.logout('user-uuid-1');

      expect(result.success).toBe(true);
      expect(usersService.updateHashedRefreshToken).toHaveBeenCalledWith('user-uuid-1', null);
    });
  });
});
