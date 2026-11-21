import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';

const startServer = async () => {
  const app = createApp();

  // Connect to MongoDB
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`
🚀 ===============================================
🛒 MegaMart API Server is running!
📡 Environment: ${env.NODE_ENV}
🌐 Local URL:   http://localhost:${env.PORT}
🩺 Health Check: http://localhost:${env.PORT}/api/v1/health
🚀 ===============================================
    `);
  });

  // Graceful shutdown handling
  const handleShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDatabase();
      console.log('Exiting process.');
      process.exit(0);
    });

    // Force shutdown after 10s if dangling connections remain
    setTimeout(() => {
      console.error('⚠️ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
};

startServer().catch((error) => {
  console.error('❌ Fatal server startup error:', error);
  process.exit(1);
});
