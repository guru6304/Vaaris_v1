import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

export type SafeUser = Omit<User, 'passwordHash' | 'hashedRefreshToken'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Safely removes sensitive fields (passwordHash, hashedRefreshToken) from User object
   */
  sanitizeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, hashedRefreshToken, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Find a user by normalized email
   */
  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
  }

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user in the database
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const normalizedEmail = data.email.trim().toLowerCase();
    return this.prisma.user.create({
      data: {
        ...data,
        email: normalizedEmail,
      },
    });
  }

  /**
   * Update the hashed refresh token for a user (or clear it on logout with null)
   */
  async updateHashedRefreshToken(userId: string, hashedRefreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }
}
