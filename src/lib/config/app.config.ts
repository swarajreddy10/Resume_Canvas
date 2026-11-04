/**
 * Application Configuration - Single Source of Truth
 * All environment variables and app settings centralized here
 */

interface AppConfig {
  env: 'development' | 'production' | 'test';
  mongodb: {
    uri: string; // pool and timeout options: connectionOptions() in src/lib/db/connection.ts
  };
  auth: {
    secret: string;
    url: string;
    google: {
      clientId: string;
      clientSecret: string;
    };
  };
  ai: {
    groqApiKey: string;
    model: string;
    reasoningEffort: 'low' | 'medium' | 'high';
    temperature: number;
    timeoutMs: number;
  };
  security: {
    rateLimits: {
      ai: { windowMs: number; maxRequests: number };
      auth: { windowMs: number; maxRequests: number };
    };
    puppeteer: {
      sandbox: boolean;
      timeout: number;
      protocolTimeout: number;
    };
  };
  app: {
    name: string;
    tagline: string;
  };
}

function validateEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    // Allow missing env vars in test environment
    if (process.env.NODE_ENV === 'test') {
      return `test-${key.toLowerCase()}`;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const appConfig: AppConfig = {
  env: (process.env.NODE_ENV as AppConfig['env']) || 'development',

  mongodb: {
    uri: validateEnv('MONGODB_URI'),
  },

  auth: {
    secret: validateEnv('NEXTAUTH_SECRET'),
    url: validateEnv('NEXTAUTH_URL'),
    google: {
      clientId: validateEnv('GOOGLE_CLIENT_ID'),
      clientSecret: validateEnv('GOOGLE_CLIENT_SECRET'),
    },
  },

  // Groq shut llama-3.3-70b-versatile down on 2026-08-16 and names openai/gpt-oss-120b
  // as its replacement (https://console.groq.com/docs/deprecations). It is a reasoning
  // model: low effort keeps replies near 1 s, 0.6 is Groq's default temperature for
  // reasoning models (https://console.groq.com/docs/reasoning), and a 20 s timeout per
  // attempt replaces the SDK's 60 s default, since calls take 1 to 3 s.
  ai: {
    groqApiKey: validateEnv('GROQ_API_KEY'),
    model: 'openai/gpt-oss-120b',
    reasoningEffort: 'low',
    temperature: 0.6,
    timeoutMs: 20_000,
  },

  security: {
    rateLimits: {
      ai: { windowMs: 60 * 60 * 1000, maxRequests: 50 },
      auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
    },
    puppeteer: {
      sandbox: process.env.NODE_ENV === 'production',
      timeout: 30000,
      protocolTimeout: 30000,
    },
  },

  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'ResumeCanvas',
    tagline:
      process.env.NEXT_PUBLIC_APP_TAGLINE ||
      'Paint Your Professional Masterpiece',
  },
};
