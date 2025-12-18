import '@testing-library/jest-dom';

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

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: () => {},
  warn: () => {},
};
