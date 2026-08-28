import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { HealthDataDto } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async checkHealth(): Promise<HealthDataDto> {
    const isDbConnected = await this.prisma.isHealthy();
    const env = this.configService.get<string>('nodeEnv', 'development');

    const result: HealthDataDto = {
      status: isDbConnected ? 'ok' : 'degraded',
      database: isDbConnected ? 'connected' : 'disconnected',
      environment: env,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    };

    // If in production and database is disconnected, throw 503 Service Unavailable
    if (!isDbConnected && env === 'production') {
      throw new ServiceUnavailableException({
        message: 'Database service is disconnected',
        details: result,
      });
    }

    return result;
  }
}
