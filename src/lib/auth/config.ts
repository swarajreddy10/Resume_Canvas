import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import { appConfig } from '@/lib/config/app.config';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(appConfig.mongodb.uri, {
    maxPoolSize: appConfig.mongodb.options.maxPoolSize,
    minPoolSize: appConfig.mongodb.options.minPoolSize,
    serverSelectionTimeoutMS:
      appConfig.mongodb.options.serverSelectionTimeoutMS,
    socketTimeoutMS: appConfig.mongodb.options.socketTimeoutMS,
  });

  global._mongoClientPromise = client.connect().catch((err) => {
    console.error('MongoDB Auth connection failed:', err);
    throw new Error('Auth database connection failed');
  });
}

const clientPromise = global._mongoClientPromise as Promise<MongoClient>;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: appConfig.auth.google.clientId,
      clientSecret: appConfig.auth.google.clientSecret,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  trustHost: true,
});
