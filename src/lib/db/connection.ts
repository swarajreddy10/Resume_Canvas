import mongoose from 'mongoose';
import { appConfig } from '@/lib/config/app.config';

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
    cached.promise = mongoose
      .connect(appConfig.mongodb.uri, {
        bufferCommands: false,
        maxPoolSize: appConfig.mongodb.options.maxPoolSize,
        minPoolSize: appConfig.mongodb.options.minPoolSize,
        serverSelectionTimeoutMS:
          appConfig.mongodb.options.serverSelectionTimeoutMS,
        socketTimeoutMS: appConfig.mongodb.options.socketTimeoutMS,
      })
      .catch((err) => {
        cached.promise = null;
        console.error('MongoDB connection failed:', err);
        throw new Error('Database connection failed');
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
