/**
 * Serves the built app for Playwright against a fresh in-memory MongoDB, so end-to-end
 * runs need no database or production secret. config/playwright.config.ts starts it
 * after `bun run build`, with the environment from tests/e2e/env.ts.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';

const port = process.env.E2E_PORT ?? '3100';
const mongo = await MongoMemoryServer.create();

const app = Bun.spawn(['bun', '--bun', 'next', 'start', '-p', port], {
  env: { ...process.env, MONGODB_URI: mongo.getUri('resumecanvas-e2e') },
  stdout: 'inherit',
  stderr: 'inherit',
});

async function shutdown(code: number): Promise<never> {
  app.kill();
  await app.exited;
  await mongo.stop();
  process.exit(code);
}

process.on('SIGINT', () => void shutdown(0));
process.on('SIGTERM', () => void shutdown(0));

const code = await app.exited;
await mongo.stop();
process.exit(code);
