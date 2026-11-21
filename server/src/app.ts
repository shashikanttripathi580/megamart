import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = (): Application => {
  const app: Application = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Request logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static product images
  const clientPublicImagesPath = path.resolve(
    process.cwd(),
    process.cwd().endsWith('server') ? '../client/public/images' : 'client/public/images'
  );
  app.use('/images', express.static(clientPublicImagesPath));

  // Root endpoint info
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      service: 'MegaMart E-Commerce Supermarket API',
      version: '0.1.0',
      status: 'active',
      endpoints: {
        health: '/api/v1/health',
      },
    });
  });

  // Mount API v1 routes
  app.use('/api/v1', routes);

  // 404 Catch-all
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
