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
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
      allowDangerousEmailAccountLinking: true,
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
    error: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
    updateAge: 60 * 60, // Refresh every 1 hour
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain:
          process.env.NODE_ENV === 'production'
            ? process.env.COOKIE_DOMAIN
            : undefined,
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.callback-url'
          : 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Host-next-auth.csrf-token'
          : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Always allow sign in - handle errors gracefully
        if (account?.provider === 'google') {
          const client = await clientPromise;
          const db = client.db();

          const existingUser = await db
            .collection('users')
            .findOne({ email: user.email?.toLowerCase() });

          if (existingUser && !existingUser.emailVerified) {
            await db
              .collection('users')
              .updateOne(
                { email: user.email?.toLowerCase() },
                { $set: { emailVerified: new Date() } }
              );
          }
        }
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        // Still allow sign in even if DB update fails
        return true;
      }
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      if (trigger === 'update' && session) {
        token.name = session.name;
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
      // Handle relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;

      // Handle same-origin URLs
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) return url;
      } catch {
        // Invalid URL, fallback to dashboard
        return `${baseUrl}/dashboard`;
      }

      // Default to dashboard for external URLs
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(
        `User signed in: ${user.email} via ${account?.provider}${isNewUser ? ' (new user)' : ''}`
      );
    },
    async signOut() {
      console.log('User signed out');
    },
  },
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
});
