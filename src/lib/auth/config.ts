import NextAuth, { type NextAuthConfig } from 'next-auth';
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
    maxPoolSize: 5,
    minPoolSize: 1,
  });
  global._mongoClientPromise = client.connect();
}

const clientPromise = global._mongoClientPromise as Promise<MongoClient>;

const hasGoogleConfig =
  appConfig.auth.google.clientId &&
  appConfig.auth.google.clientSecret &&
  appConfig.auth.google.clientId !== 'your-google-client-id';

if (!hasGoogleConfig) {
  console.warn('Google OAuth not configured - provider will be disabled');
}

export async function authorizeCredentials(
  credentials: Partial<Record<'email' | 'password', unknown>>
) {
  try {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password required');
    }

    if (
      typeof credentials.email !== 'string' ||
      typeof credentials.password !== 'string'
    ) {
      throw new Error('Invalid credentials format');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !emailRegex.test(credentials.email) ||
      credentials.email.length > 255
    ) {
      throw new Error('Invalid email format');
    }

    if (
      credentials.password.length < 8 ||
      credentials.password.length > 128
    ) {
      throw new Error('Invalid password length');
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db
      .collection('users')
      .findOne(
        { email: credentials.email.toLowerCase() },
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
}

export const authConfig: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    ...(hasGoogleConfig
      ? [
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
        ]
      : []),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
      },
      authorize: authorizeCredentials,
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
    // Google sign-in links to an existing user with the same email
    // (allowDangerousEmailAccountLinking), which Auth.js supports only when the provider
    // "has securely verified the email address" (authjs.dev/reference/core/providers).
    // Google reports that as `email_verified`, so an unverified profile is refused.
    // Registration never verifies an email, so a password on an unverified account may
    // have been set by someone who registered the address first; the Google sign-in is
    // the first proof of ownership, so that password is removed in the same write that
    // records the verification. The owner can set a new one through forgot-password.
    // A failed write throws, which Auth.js turns into AccessDenied: linking must never
    // proceed with the unproven password still valid.
    async signIn({ account, profile }) {
      if (account?.provider !== 'google') return true;
      if (profile?.email_verified !== true || typeof profile.email !== 'string') {
        return false;
      }

      const client = await clientPromise;
      await client
        .db()
        .collection('users')
        .updateOne(
          { email: profile.email.toLowerCase(), emailVerified: null },
          { $set: { emailVerified: new Date() }, $unset: { password: '' } }
        );
      return true;
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
    // Auth.js creates a user from an OAuth profile with emailVerified: null. Record the
    // Google verification at link time, so a password the owner sets later through
    // forgot-password is not removed by their next Google sign-in.
    async linkAccount({ user, account }) {
      if (account.provider !== 'google' || !user.email) return;
      const client = await clientPromise;
      await client
        .db()
        .collection('users')
        .updateOne(
          { email: user.email.toLowerCase(), emailVerified: null },
          { $set: { emailVerified: new Date() } }
        );
    },
  },
  debug: false,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
