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
    maxTokens: number;
    temperature: number;
  };
  security: {
    rateLimits: {
      api: { windowMs: number; maxRequests: number };
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

  ai: {
    groqApiKey: validateEnv('GROQ_API_KEY'),
    model: 'llama-3.3-70b-versatile', // Latest powerful model for better analysis
    maxTokens: 2000, // Increased for detailed feedback
    temperature: 0.7,
  },

  security: {
    rateLimits: {
      api: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
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
