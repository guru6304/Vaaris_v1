import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? [
              { emit: 'event', level: 'query' },
              { emit: 'stdout', level: 'error' },
              { emit: 'stdout', level: 'warn' },
            ]
          : [{ emit: 'stdout', level: 'error' }],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma connected successfully to PostgreSQL database.');
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL database via Prisma:', error);
      // We do not throw fatal crash on init in local/test without database
      // allowing health checks to report database connectivity accurately
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Prisma disconnected gracefully.');
    } catch (error) {
      this.logger.error('Error during Prisma disconnect:', error);
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.warn(`Database health check failed: ${error?.message || error}`);
      return false;
    }
  }
}
