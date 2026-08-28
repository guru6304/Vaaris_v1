import { validateEnvironment } from './validation';

describe('validateEnvironment', () => {
  it('should pass with valid development configuration', () => {
    const validConfig = {
      NODE_ENV: 'development',
      PORT: '3001',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/vaaris_db',
    };

    expect(() => validateEnvironment(validConfig)).not.toThrow();
  });

  it('should throw when PORT is invalid', () => {
    const invalidConfig = {
      NODE_ENV: 'development',
      PORT: 'invalid-port',
    };

    expect(() => validateEnvironment(invalidConfig)).toThrow(
      /PORT must be a valid port number/,
    );
  });

  it('should throw when NODE_ENV is invalid', () => {
    const invalidConfig = {
      NODE_ENV: 'invalid_env',
      PORT: '3001',
    };

    expect(() => validateEnvironment(invalidConfig)).toThrow(
      /NODE_ENV must be one of/,
    );
  });

  it('should throw in production if DATABASE_URL is missing', () => {
    const prodConfigWithoutDb = {
      NODE_ENV: 'production',
      PORT: '3001',
    };

    expect(() => validateEnvironment(prodConfigWithoutDb)).toThrow(
      /DATABASE_URL is required in production/,
    );
  });
});
