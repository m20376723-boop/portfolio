import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectDatabase } from './config/database';
import { seedDatabase } from './utils/seed';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDatabase();

    // 2. Run seed check
    await seedDatabase();

    // 3. Create app and start listening
    const app = createApp();
    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Portfolio Backend running on http://localhost:${PORT}`);
      console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`⚡ API Health check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    // Graceful Shutdown
    const shutdown = () => {
      console.log('\n[Process] Received termination signal. Closing HTTP server gracefully...');
      server.close(() => {
        console.log('[Process] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Startup Error] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
