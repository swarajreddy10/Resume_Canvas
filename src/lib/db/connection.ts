import mongoose, { type ConnectOptions } from 'mongoose';
import { appConfig } from '@/lib/config/app.config';

// Treat any `$`-prefixed object inside a query filter as a literal value, so request
// data can never become a query operator. Code that needs an operator wraps it in
// mongoose.trusted(). https://mongoosejs.com/docs/api/mongoose.html#Mongoose.prototype.sanitizeFilter()
mongoose.set('sanitizeFilter', true);
// Validate updates against the schema too (Mongoose leaves update validators off by
// default). https://mongoosejs.com/docs/validation.html#update-validators
mongoose.set('runValidators', true);

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

/**
 * Options for the Mongoose connection pool.
 *
 * - In production, indexes and collections are built once per deploy by
 *   `bun run db:sync-indexes`, so a cold start sends no createIndexes or create commands.
 *   Development and test keep Mongoose's autoIndex/autoCreate.
 *   https://mongoosejs.com/docs/guide.html#indexes
 */
export function connectionOptions(
  nodeEnv = process.env.NODE_ENV
): ConnectOptions {
  const buildSchemaObjects = nodeEnv !== 'production';
  return {
    bufferCommands: false,
    autoIndex: buildSchemaObjects,
    autoCreate: buildSchemaObjects,
    maxPoolSize: 20,
    minPoolSize: 10,
    maxIdleTimeMS: 15000,
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 5000,
    heartbeatFrequencyMS: 5000,
    compressors: 'zlib',
    zlibCompressionLevel: 1,
    readPreference: 'primaryPreferred',
    retryWrites: true,
    w: 'majority',
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = Promise.race([
      mongoose.connect(appConfig.mongodb.uri, connectionOptions()),
      new Promise<typeof mongoose>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 3000)
      ),
    ]).catch((err) => {
        cached.promise = null;
        console.error('MongoDB connection failed:', err);
        throw new Error('Database connection failed');
      });
  }

  try {
    cached.conn = await cached.promise;
    cached.conn.set('bufferCommands', false);
    cached.conn.set('maxTimeMS', 5000); // 5 second query timeout
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
