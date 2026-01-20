import mongoose from 'mongoose';
import { appConfig } from '@/lib/config/app.config';
import { optimizeDatabase } from './optimizer';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongoose || {
  conn: null,
  promise: null,
};

if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      maxPoolSize: 20, // Increased pool size
      minPoolSize: 10, // Higher minimum
      serverSelectionTimeoutMS: 3000, // Faster timeout
      socketTimeoutMS: 30000,
      maxIdleTimeMS: 15000, // Faster cleanup
      // Ultra performance optimizations
      compressors: 'zlib',
      zlibCompressionLevel: 1 as const, // Fast compression
      readPreference: 'primaryPreferred' as const,
      retryWrites: true,
      w: 'majority' as const,
      // Connection optimization
      heartbeatFrequencyMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = Promise.race([
      mongoose.connect(appConfig.mongodb.uri, options),
      new Promise<typeof mongoose>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 3000)
      ),
    ])
      .then(async (conn) => {
        // Optimize database after connection
        await optimizeDatabase();
        return conn;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('MongoDB connection failed:', err);
        throw new Error('Database connection failed');
      });
  }

  try {
    cached.conn = await cached.promise;
    // Ultra performance settings
    cached.conn.set('bufferCommands', false);
    cached.conn.set('maxTimeMS', 5000); // 5 second query timeout
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
