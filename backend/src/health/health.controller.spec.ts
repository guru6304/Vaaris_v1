import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HealthDataDto } from './dto/health-response.dto';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const mockHealthData: HealthDataDto = {
      status: 'ok',
      database: 'connected',
      environment: 'development',
      timestamp: new Date().toISOString(),
      uptime: 42,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            checkHealth: jest.fn().mockResolvedValue(mockHealthData),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health data', async () => {
    const result = await controller.getHealth();
    expect(result.status).toBe('ok');
    expect(result.database).toBe('connected');
    expect(service.checkHealth).toHaveBeenCalled();
  });
});
