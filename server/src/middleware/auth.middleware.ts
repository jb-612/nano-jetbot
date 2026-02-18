import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers[config.apiKeyHeader] as string | undefined;
  if (!apiKey || apiKey !== config.defaultApiKey) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or missing API key' },
      timestamp: Date.now(),
      requestId: (req as Record<string, unknown>).requestId as string ?? 'unknown',
    });
    return;
  }
  next();
}
