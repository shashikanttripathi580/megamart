import { Request, Response } from 'express';
import { getDbStatus } from '../config/db.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

const startTime = Date.now();

export const getHealthStatus = (_req: Request, res: Response): void => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage();
  const dbStatus = getDbStatus();

  const healthData = {
    status: 'ok',
    service: 'megamart-server',
    version: '0.1.0',
    environment: env.NODE_ENV,
    uptimeSeconds,
    uptimeFormatted: formatUptime(uptimeSeconds),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      isConnected: dbStatus === 'connected',
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        rssMB: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
        heapUsedMB: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
      },
    },
  };

  const response = new ApiResponse({
    statusCode: 200,
    message: 'MegaMart API is running healthy',
    data: healthData,
  });

  res.status(response.statusCode).json(response.toJSON());
};

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
}
