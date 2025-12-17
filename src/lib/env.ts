import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    MONGODB_URI: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GROQ_API_KEY: z.string().min(1),
    KV_REST_API_URL: z.string().url().optional(),
    KV_REST_API_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default('ResumeCanvas'),
    NEXT_PUBLIC_APP_TAGLINE: z
      .string()
      .default('Paint Your Professional Masterpiece'),
  },
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_TAGLINE: process.env.NEXT_PUBLIC_APP_TAGLINE,
  },
});
