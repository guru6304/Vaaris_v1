import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3001);
  const apiPrefix = configService.get<string>('apiPrefix', 'api/v1');
  const corsOrigins = configService.get<string[]>('cors.origin', ['http://localhost:5173', 'http://localhost:3000']);
  const nodeEnv = configService.get<string>('nodeEnv', 'development');

  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  // CORS Configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // In non-production, allow any localhost or 127.0.0.1 port (e.g. 5173, 5174, 5175)
      if (nodeEnv !== 'production') {
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
      }

      if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    credentials: true,
  });

  // Global API Prefix (/api/v1)
  app.setGlobalPrefix(apiPrefix, {
    exclude: ['/'],
  });

  // Global Validation Pipe with strict whitelisting & transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Centralized Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Response & Logging Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger / OpenAPI Configuration (/api/docs)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('VAARIS API')
    .setDescription(
      'VAARIS Family Financial Continuity Platform — Backend API Foundation\n\n' +
      'Core Security Principle: Family is the primary security boundary. Authorization is strictly enforced server-side.'
    )
    .setVersion('1.0')
    .addTag('Health', 'System health checks & database connectivity status')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT Bearer token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'VAARIS API Documentation',
  });

  await app.listen(port, '0.0.0.0');

  logger.log(`====================================================`);
  logger.log(`VAARIS Backend Foundation running successfully!`);
  logger.log(`Environment: ${nodeEnv}`);
  logger.log(`Port:        ${port}`);
  logger.log(`API Prefix:  /${apiPrefix}`);
  logger.log(`Health:      http://localhost:${port}/${apiPrefix}/health`);
  logger.log(`Swagger Docs: http://localhost:${port}/api/docs`);
  logger.log(`====================================================`);
}

bootstrap();
