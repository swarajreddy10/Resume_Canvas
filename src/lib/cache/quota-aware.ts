import type { VercelKV } from '@vercel/kv';

let kv: VercelKV | null = null;

try {
  const kvModule = await import('@vercel/kv');
  kv = kvModule.kv;
} catch {
  // KV not available
}

export async function safeKvGet<T>(key: string): Promise<T | null> {
  if (!kv) return null;
  try {
    return await kv.get<T>(key);
  } catch {
    return null;
  }
}

export async function safeKvSet<T>(
  key: string,
  value: T,
  ttl = 300
): Promise<void> {
  if (!kv) return;
  try {
    await kv.set(key, value, { ex: ttl });
  } catch {
    // Silent fail
  }
}

export async function safeKvDel(key: string): Promise<void> {
  if (!kv) return;
  try {
    await kv.del(key);
  } catch {
    // Silent fail
  }
}
