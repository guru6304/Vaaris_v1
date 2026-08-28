import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockPrismaService = {
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined),
      isHealthy: jest.fn().mockResolvedValue(true),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /api/v1/health returns structured health payload with request ID', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('status', 'ok');
    expect(response.body.data).toHaveProperty('database', 'connected');
    expect(response.body.data).toHaveProperty('environment');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toHaveProperty('requestId');
    expect(response.body.meta).toHaveProperty('timestamp');
  });

  it('preserves incoming x-request-id header across pipeline', async () => {
    const customId = 'test-trace-uuid-12345';

    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .set('x-request-id', customId)
      .expect(200);

    expect(response.headers['x-request-id']).toBe(customId);
    expect(response.body.meta.requestId).toBe(customId);
  });

  it('returns standard error structure on 404 Not Found', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/non-existent-endpoint')
      .expect(404);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(response.body.error).toHaveProperty('message');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toHaveProperty('requestId');
  });
});
