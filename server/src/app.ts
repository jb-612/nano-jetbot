import express from 'express';
import { robotRouter } from './routes/robot.routes.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { config } from './config.js';

export function createApp() {
  const app = express();

  // CORS
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', config.corsOrigin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
    if (_req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.use(express.json());
  app.use(loggerMiddleware);
  app.use('/api/robot', robotRouter);
  app.use(errorMiddleware);

  return app;
}
