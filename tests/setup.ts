import '@testing-library/jest-dom';
import { mock } from 'bun:test';
import { MockGroq } from './helpers/groq';

// Global test setup
(process.env as Record<string, string>).NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.GROQ_API_KEY = 'test-groq-key';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.NEXT_PUBLIC_APP_NAME = 'ResumeCanvas';
process.env.NEXT_PUBLIC_APP_TAGLINE = 'Paint Your Professional Masterpiece';

// No test reaches the real Groq API. Mocking here, before any test file imports the app,
// keeps the real client from ever being constructed. https://bun.com/docs/test/mocks
mock.module('groq-sdk', () => ({ default: MockGroq, Groq: MockGroq }));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: () => {},
  warn: () => {},
};
