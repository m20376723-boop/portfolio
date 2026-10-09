import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<string> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

  try {
    // Attempt connection to provided MongoDB URI
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
    return uri;
  } catch (error: any) {
    console.warn(`[Database] Could not connect to primary MongoDB at "${uri}": ${error.message}`);
    console.log('[Database] Starting in-memory MongoDB fallback for seamless development...');

    try {
      // Dynamic import of mongodb-memory-server to avoid requiring it in production bundles
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] In-memory MongoDB connected successfully: ${memoryUri}`);
      return memoryUri;
    } catch (fallbackError: any) {
      console.error('[Database] Failed to initialize in-memory MongoDB fallback:', fallbackError.message);
      throw error;
    }
  }
};
