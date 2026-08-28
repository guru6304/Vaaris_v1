export function validateEnvironment(config: Record<string, unknown>) {
  const errors: string[] = [];

  const nodeEnv = config.NODE_ENV || 'development';
  if (!['development', 'production', 'test', 'staging'].includes(nodeEnv as string)) {
    errors.push(`NODE_ENV must be one of: development, production, test, staging (received: ${nodeEnv})`);
  }

  const port = parseInt((config.PORT as string) || '3001', 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    errors.push(`PORT must be a valid port number between 1 and 65535 (received: ${config.PORT})`);
  }

  if (nodeEnv === 'production' && !config.DATABASE_URL) {
    errors.push('DATABASE_URL is required in production environment.');
  }

  if (errors.length > 0) {
    throw new Error(`Environment Configuration Error:\n- ${errors.join('\n- ')}`);
  }

  return config;
}
