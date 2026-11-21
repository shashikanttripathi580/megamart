import mongoose from 'mongoose';
import { env } from './env.js';

export type ConnectionState = 'disconnected' | 'connected' | 'connecting' | 'disconnecting' | 'unknown';

const stateMap: Record<number, ConnectionState> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export const getDbStatus = (): ConnectionState => {
  const readyState = mongoose.connection.readyState;
  return stateMap[readyState] ?? 'unknown';
};

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

let memoryServerInstance: any = null;

export const connectDatabase = async (): Promise<void> => {
  const uri = env.MONGODB_URI;

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB connection disconnected');
  });

  try {
    console.log(`⏳ Connecting to MongoDB (${env.NODE_ENV})...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
  } catch (error) {
    console.warn('⚠️ Primary MongoDB connection failed:', (error as Error).message);

    if (env.NODE_ENV === 'development') {
      try {
        console.log('💡 Initializing development in-memory MongoDB with auto-seeded supermarket data...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const { seedDatabase } = await import('../seed/index.js');
        memoryServerInstance = await MongoMemoryServer.create();
        const memUri = memoryServerInstance.getUri();
        await mongoose.connect(memUri);
        console.log(`✅ Development database running at ${memUri}`);
        await seedDatabase(memUri);
        console.log('🎉 Supermarket catalog auto-seeded successfully for development!');
      } catch (memErr) {
        console.error('❌ Failed to start in-memory database fallback:', (memErr as Error).message);
      }
    } else {
      console.warn('⚠️ Server will continue running so health check & APIs can report status.');
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = null;
  }
};
