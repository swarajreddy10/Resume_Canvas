import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import { appConfig } from '@/lib/config/app.config';
import bcrypt from 'bcryptjs';

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
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password required');
          }

          const client = await clientPromise;
          const db = client.db();
          const user = await db
            .collection('users')
            .findOne(
              { email: (credentials.email as string).toLowerCase() },
              { projection: { _id: 1, email: 1, name: 1, password: 1 } }
            );

          if (!user) {
            throw new Error('No account found with this email');
          }

          if (!user.password) {
            throw new Error('Please sign in with Google');
          }

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (!valid) {
            throw new Error('Incorrect password');
          }

          return {
            id: user._id.toString(),
            email: user.email as string,
            name: user.name as string,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  trustHost: true,
});
