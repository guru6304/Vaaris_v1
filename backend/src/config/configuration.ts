export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  database: {
    url: string;
  };
  cors: {
    origin: string[];
  };
  jwt?: {
    accessSecret?: string;
    refreshSecret?: string;
    accessExpiresIn?: string;
    refreshExpiresIn?: string;
  };
  storage?: {
    region?: string;
    bucket?: string;
    accessKey?: string;
    secretKey?: string;
  };
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vaaris_db?schema=public',
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim()),
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  storage: {
    region: process.env.STORAGE_REGION,
    bucket: process.env.STORAGE_BUCKET,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
  },
});
