import mongoose from 'mongoose';
import { appConfig } from '@/lib/config/app.config';

let mongooseConnection: typeof mongoose | null = null;

export async function getMongooseConnection() {
  if (mongooseConnection) return mongooseConnection;

  mongooseConnection = await mongoose.connect(appConfig.mongodb.uri, {
    bufferCommands: false,
    maxPoolSize: appConfig.mongodb.options.maxPoolSize,
    minPoolSize: appConfig.mongodb.options.minPoolSize,
    serverSelectionTimeoutMS:
      appConfig.mongodb.options.serverSelectionTimeoutMS,
    socketTimeoutMS: appConfig.mongodb.options.socketTimeoutMS,
    maxIdleTimeMS: 60000,
  });

  return mongooseConnection;
}

export async function getMongoClient() {
  const conn = await getMongooseConnection();
  return conn.connection.getClient();
}
