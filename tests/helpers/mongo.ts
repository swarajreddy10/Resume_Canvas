/**
 * Real MongoDB for integration tests: one in-memory mongod per test process.
 *
 * Bun runs every test file in one process, and the app config reads MONGODB_URI once at
 * import time, so all files share one server. Call startMongo() before importing route
 * handlers (import them dynamically). A unit test file that ran earlier in the same
 * process may already have loaded the config with the preload's placeholder URI, so
 * startMongo() also points the loaded config at this server.
 * https://bun.com/docs/cli/test
 */
import { MongoMemoryServer } from 'mongodb-memory-server';

let server: Promise<MongoMemoryServer> | undefined;

export async function startMongo(): Promise<string> {
  if (!server) {
    server = MongoMemoryServer.create();
    process.once('beforeExit', async () => {
      const { default: mongoose } = await import('mongoose');
      await mongoose.disconnect();
      await (await server!).stop();
    });
  }
  const uri = (await server).getUri('resumecanvas-test');
  process.env.MONGODB_URI = uri;
  const { appConfig } = await import('@/lib/config/app.config');
  appConfig.mongodb.uri = uri;
  return uri;
}

/**
 * Leave the server running for the next file; just delete this file's documents.
 * Collections and their indexes stay: Mongoose builds schema indexes once per process
 * (when a model is compiled), so dropping the database would leave later files without
 * the unique indexes the app relies on (for example one account per email).
 */
export async function stopMongo(): Promise<void> {
  const { default: mongoose } = await import('mongoose');
  const db = mongoose.connection.db;
  if (!db) return;
  for (const collection of await db.collections()) {
    await collection.deleteMany({});
  }
}

let clientCounter = 0;

/**
 * Build the Request a route handler receives. Each call comes from a new client
 * address unless one is given, so per-client rate limits do not leak between tests.
 */
export function jsonRequest(
  url: string,
  body: unknown,
  clientIp?: string
): Request {
  const ip = clientIp ?? `198.51.100.${(clientCounter++ % 250) + 1}`;
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}
