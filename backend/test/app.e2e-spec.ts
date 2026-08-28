import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';
import { TransformInterceptor } from './../src/common/interceptors/transform.interceptor';
import { PrismaService } from './../src/prisma/prisma.service';

describe('VAARIS End-to-End Integration & Security Test Suite', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const timestamp = Date.now();
  const userAEmail = `user_a_${timestamp}@example.com`;
  const userBEmail = `user_b_${timestamp}@example.com`;
  const password = 'StrongPassword123!';

  let userAToken: string;
  let userARefreshToken: string;
  let userBToken: string;
  let familyAId: string;
  let familyBId: string;
  let assetAId: string;
  let docAId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1', { exclude: ['/'] });
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
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    // Clean up test data
    try {
      if (familyAId) {
        await prisma.family.delete({ where: { id: familyAId } }).catch(() => {});
      }
      if (familyBId) {
        await prisma.family.delete({ where: { id: familyBId } }).catch(() => {});
      }
      await prisma.user
        .deleteMany({
          where: {
            email: { in: [userAEmail, userBEmail] },
          },
        })
        .catch(() => {});
    } catch {
      // Ignore cleanup error
    }

    await app.close();
  });

  describe('1. Health & Foundation', () => {
    it('GET /api/v1/health should return ok status and database connected', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ok');
      expect(res.body.data.database).toBe('connected');
    });
  });

  describe('2. Authentication Flow (Registration & Login)', () => {
    it('POST /api/v1/auth/register should successfully register User A', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: userAEmail,
          password: password,
          fullName: 'Alice Sharma',
          phoneNumber: '+919999900001',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(userAEmail.toLowerCase());
      expect(res.body.data.user.fullName).toBe('Alice Sharma');
      expect(res.body.data.user.passwordHash).toBeUndefined();
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).toBeDefined();

      userAToken = res.body.data.tokens.accessToken;
      userARefreshToken = res.body.data.tokens.refreshToken;
    });

    it('POST /api/v1/auth/register should register User B', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: userBEmail,
          password: password,
          fullName: 'Bob Verma',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      userBToken = res.body.data.tokens.accessToken;
    });

    it('POST /api/v1/auth/login should authenticate with valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: userAEmail,
          password: password,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });

    it('POST /api/v1/auth/refresh should rotate tokens using valid refresh token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: userARefreshToken })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens.accessToken).toBeDefined();
      userAToken = res.body.data.tokens.accessToken;
    });

    it('GET /api/v1/auth/me should return profile for authenticated user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(userAEmail.toLowerCase());
    });
  });

  describe('3. Family Creation & Membership', () => {
    it('POST /api/v1/families should create Family Alpha for User A', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/families')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ name: 'Alpha Family Estate' })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Alpha Family Estate');
      expect(res.body.data.myRole).toBe('PRIMARY_ADMIN');
      familyAId = res.body.data.id;
    });

    it('POST /api/v1/families should create Family Beta for User B', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/families')
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ name: 'Beta Family Workspace' })
        .expect(201);

      expect(res.body.success).toBe(true);
      familyBId = res.body.data.id;
    });
  });

  describe('4. Financial Records & Nominees Endpoints', () => {
    it('POST /api/v1/families/:familyId/records should create an asset in Family Alpha', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/families/${familyAId}/records`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          name: 'HDFC Savings Account',
          category: 'bank_accounts',
          institution: 'HDFC Bank',
          accountNumberMasked: '•••• 4821',
          value: 450000,
          nomineeStatus: 'Verified',
          source: 'Document verified',
          notes: 'Emergency fund',
          nominees: [
            { name: 'Ananya Sharma', relationship: 'Spouse', sharePercentage: 100 },
          ],
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('HDFC Savings Account');
      expect(res.body.data.value).toBe(450000);
      expect(res.body.data.nominees.length).toBe(1);
      assetAId = res.body.data.id;
    });

    it('GET /api/v1/families/:familyId/records should list records for Family Alpha', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/families/${familyAId}/records`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].id).toBe(assetAId);
    });

    it('PUT /api/v1/families/:familyId/records/:id/nominees should update nominees', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/families/${familyAId}/records/${assetAId}/nominees`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          status: 'Verified',
          nominees: [
            { name: 'Ananya Sharma', relationship: 'Spouse', sharePercentage: 70 },
            { name: 'Rohan Sharma', relationship: 'Son', sharePercentage: 30 },
          ],
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nomineeStatus).toBe('Verified');
      expect(res.body.data.nominees.length).toBe(2);
    });
  });

  describe('5. Family Vault / Documents Endpoints', () => {
    it('POST /api/v1/families/:familyId/documents should catalog a document in Family Alpha', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/families/${familyAId}/documents`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          name: 'HDFC Passbook Statement.pdf',
          category: 'Financial Documents',
          linkedAssetId: assetAId,
          linkedAssetName: 'HDFC Savings Account',
          fileSizeBytes: 1250000,
          status: 'Document Processed',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('HDFC Passbook Statement.pdf');
      docAId = res.body.data.id;
    });

    it('GET /api/v1/families/:familyId/documents should list documents for Family Alpha', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/families/${familyAId}/documents`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.some((d: any) => d.id === docAId)).toBe(true);
    });
  });

  describe('6. Continuity Plan & Live Dashboard Metrics', () => {
    it('GET /api/v1/families/:familyId/continuity should get or init continuity plan', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/families/${familyAId}/continuity`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.familyId).toBe(familyAId);
    });

    it('GET /api/v1/families/:familyId/dashboard should return real computed metrics', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/families/${familyAId}/dashboard`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.metrics.totalAssetValue).toBe(450000);
      expect(res.body.data.metrics.netWorth).toBe(450000);
      expect(res.body.data.metrics.readinessScore).toBeGreaterThanOrEqual(50);
      expect(Array.isArray(res.body.data.readinessBreakdown)).toBe(true);
    });
  });

  describe('7. MANDATORY Cross-Family Security & Isolation Enforcement', () => {
    it('SECURITY TEST: User B CANNOT access Family Alpha financial records (403 Forbidden)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/families/${familyAId}/records`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('SECURITY TEST: User B CANNOT add an asset to Family Alpha (403 Forbidden)', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/families/${familyAId}/records`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          name: 'Intruder Account',
          category: 'bank_accounts',
          institution: 'Fake Bank',
          value: 1000000,
        })
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('SECURITY TEST: User B CANNOT access Family Alpha documents (403 Forbidden)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/families/${familyAId}/documents`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('SECURITY TEST: User B CANNOT access Family Alpha continuity plan (403 Forbidden)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/families/${familyAId}/continuity`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('SECURITY TEST: User B CANNOT access Family Alpha dashboard metrics (403 Forbidden)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/families/${familyAId}/dashboard`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });
});
