import mongoose, { type ConnectOptions } from 'mongoose';
import type { MongoClient } from 'mongodb';
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
 * Options for the one connection pool each server instance holds.
 *
 * - In production, indexes and collections are built once per deploy by
 *   `bun run db:sync-indexes`, so a cold start sends no createIndexes or create commands.
 *   Development and test keep Mongoose's autoIndex/autoCreate.
 *   https://mongoosejs.com/docs/guide.html#indexes
 * - Serverless sizing: keep one connection warm and close idle ones after 5 s.
 *   https://vercel.com/kb/guide/efficiently-manage-database-connection-pools-with-fluid-compute
 * - serverSelectionTimeoutMS bounds how long connect() waits for a server, so no
 *   separate timer is raced against it.
 *   https://www.mongodb.com/docs/drivers/node/current/connect/connection-options/
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
    minPoolSize: 1,
    maxIdleTimeMS: 5000,
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
    cached.promise = mongoose
      .connect(appConfig.mongodb.uri, connectionOptions())
      .catch((err) => {
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

/**
 * The driver client behind the Mongoose connection. Anything else that needs a raw
 * MongoClient (the Auth.js MongoDB adapter) takes this one, so each instance holds a
 * single pool instead of a second MongoClient of its own.
 */
export async function getMongoClient(): Promise<MongoClient> {
  return (await connectDB()).connection.getClient();
}

export default connectDB;
