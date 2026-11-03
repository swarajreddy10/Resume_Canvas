/**
 * Configuration for the app under end-to-end test. Every value is a local placeholder:
 * MongoDB is in-memory (scripts/e2e-server.ts replaces MONGODB_URI once it starts),
 * Google sign-in, Groq and Resend are never reached by the specs.
 */
export const E2E_PORT = Number(process.env.E2E_PORT ?? 3100);
export const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;

export const e2eEnv: Record<string, string> = {
  E2E_PORT: String(E2E_PORT),
  MONGODB_URI: 'mongodb://127.0.0.1:1/replaced-by-e2e-server',
  NEXTAUTH_URL: E2E_BASE_URL,
  NEXTAUTH_SECRET: 'e2e-only-secret-0123456789abcdef0123456789abcdef',
  GOOGLE_CLIENT_ID: 'e2e-placeholder',
  GOOGLE_CLIENT_SECRET: 'e2e-placeholder',
  GROQ_API_KEY: 'e2e-placeholder',
  RESEND_API_KEY: 're_e2e_placeholder',
  RESEND_FROM_EMAIL: 'e2e@example.com',
  RESEND_FROM_NAME: 'ResumeCanvas E2E',
};
