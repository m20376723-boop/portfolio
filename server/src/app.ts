import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middleware/error.middleware';
import { ApiResponse } from './utils/apiResponse';

export const createApp = (): Express => {
  const app = express();

  // Security Middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow serving uploaded images
    })
  );

  // CORS Configuration
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  app.use(
    cors({
      origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Request Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads serving
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Swagger Documentation
  setupSwagger(app);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    ApiResponse.success(
      res,
      'Portfolio API is healthy and operational',
      {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      },
      200
    );
  });

  // REST API Routes
  app.use('/api', apiRoutes);

  // 404 Handler for undefined API routes
  app.use((req: Request, res: Response) => {
    ApiResponse.error(res, `Route not found: ${req.method} ${req.originalUrl}`, null, 404);
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};
