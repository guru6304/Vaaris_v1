import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthService', () => {
  let service: HealthService;
  let prismaService: jest.Mocked<Partial<PrismaService>>;
  let configService: jest.Mocked<Partial<ConfigService>>;

  beforeEach(async () => {
    prismaService = {
      isHealthy: jest.fn(),
    };

    configService = {
      get: jest.fn().mockReturnValue('development'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: PrismaService, useValue: prismaService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should return status ok and database connected when Prisma is healthy', async () => {
    (prismaService.isHealthy as jest.Mock).mockResolvedValue(true);

    const result = await service.checkHealth();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('connected');
    expect(result.environment).toBe('development');
    expect(result.timestamp).toBeDefined();
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should return status degraded and database disconnected when Prisma is unhealthy in development', async () => {
    (prismaService.isHealthy as jest.Mock).mockResolvedValue(false);

    const result = await service.checkHealth();

    expect(result.status).toBe('degraded');
    expect(result.database).toBe('disconnected');
  });
});
