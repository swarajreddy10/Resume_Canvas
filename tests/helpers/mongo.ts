/**
 * Real MongoDB for integration tests: an in-memory mongod started per test file.
 *
 * Call startMongo() before importing any module that reads MONGODB_URI (the app
 * config reads it at import time), then import route handlers dynamically.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';

let server: MongoMemoryServer | undefined;

export async function startMongo(): Promise<string> {
  server = await MongoMemoryServer.create();
  const uri = server.getUri('resumecanvas-test');
  process.env.MONGODB_URI = uri;
  return uri;
}

export async function stopMongo(): Promise<void> {
  const { default: mongoose } = await import('mongoose');
  await mongoose.disconnect();
  await server?.stop();
}

let clientCounter = 0;

/**
 * Build the Request a route handler receives. Each call comes from a new client
 * address unless one is given, so per-client rate limits do not leak between tests.
 */
export function jsonRequest(url: string, body: unknown, clientIp?: string): Request {
  const ip = clientIp ?? `198.51.100.${(clientCounter++ % 250) + 1}`;
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}
