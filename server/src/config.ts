export const config = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  apiKeyHeader: 'x-api-key',
  defaultApiKey: process.env.API_KEY ?? 'dev-key-12345',
  telemetryIntervalMs: 200, // 5Hz
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};
