/**
 * Fixed-window rate limiting behind one store interface.
 *
 * The only store today is in memory, so on Vercel every function instance counts on its
 * own and a client spread across instances gets more than the limit. Vercel's shared
 * limiter (@vercel/firewall checkRateLimit) needs a rule created in the project's
 * Firewall dashboard first, so it cannot be switched on from code: the edge rule the
 * owner configures there is the cross-instance limit, and these in-process counts are
 * the per-account layer under it.
 * https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk
 *
 * A Firewall-backed store implements RateLimitStore by calling
 * checkRateLimit(rule.id, { request, rateLimitKey: key }); nothing else changes.
 */
import { appConfig } from '@/lib/config/app.config';

export interface RateLimitRule {
  /** Names the counter; for a Vercel Firewall store, the rule's Rate limit ID. */
  id: string;
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export interface RateLimitStore {
  hit(rule: RateLimitRule, key: string, request: Request): Promise<RateLimitResult>;
}

/** Per-process counters. Keys whose window has ended are dropped when the map is full. */
export class MemoryRateLimitStore implements RateLimitStore {
  private readonly windows = new Map<string, { count: number; resetTime: number }>();

  constructor(private readonly maxKeys = 10_000) {}

  async hit(rule: RateLimitRule, key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const id = `${rule.id}:${key}`;
    let window = this.windows.get(id);

    if (!window || window.resetTime <= now) {
      this.windows.delete(id);
      this.makeRoom(now);
      window = { count: 0, resetTime: now + rule.windowMs };
      this.windows.set(id, window);
    }

    if (window.count >= rule.maxRequests) {
      return { success: false, remaining: 0, resetTime: window.resetTime };
    }

    window.count += 1;
    return {
      success: true,
      remaining: rule.maxRequests - window.count,
      resetTime: window.resetTime,
    };
  }

  private makeRoom(now: number): void {
    if (this.windows.size < this.maxKeys) return;
    for (const [id, window] of this.windows) {
      if (window.resetTime <= now) this.windows.delete(id);
    }
    // Still full of live windows: drop the oldest (a Map iterates in insertion order).
    for (const id of this.windows.keys()) {
      if (this.windows.size < this.maxKeys) break;
      this.windows.delete(id);
    }
  }
}

const memoryStore = new MemoryRateLimitStore();

export class RateLimiter {
  constructor(
    public readonly rule: RateLimitRule,
    private readonly store: RateLimitStore = memoryStore
  ) {}

  check(key: string, request: Request): Promise<RateLimitResult> {
    return this.store.hit(this.rule, key, request);
  }
}

/**
 * The client address. On Vercel, x-forwarded-for is overwritten with the client's
 * public IP, so a client cannot spoof it; x-real-ip is identical.
 * https://vercel.com/docs/headers/request-headers#x-forwarded-for
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** A signed-in user is counted as themselves wherever they connect from. */
export function userOrIpKey(request: Request, userEmail?: string | null): string {
  return userEmail ? `user:${userEmail.toLowerCase()}` : `ip:${clientIp(request)}`;
}

/**
 * Auth endpoints count per client IP and email together, so one client cannot hammer
 * one account, and a client cannot lock the owner out from the owner's own address.
 * The IP never contains '|', so the key cannot be forged by an email that does.
 */
export function authAttemptKey(scope: string, request: Request, email?: unknown): string {
  const account = typeof email === 'string' ? email.trim().toLowerCase() : '';
  return `${scope}:${clientIp(request)}|${account}`;
}

const { rateLimits } = appConfig.security;

export const aiRateLimit = new RateLimiter({ id: 'ai', ...rateLimits.ai });
export const authRateLimit = new RateLimiter({ id: 'auth', ...rateLimits.auth });
