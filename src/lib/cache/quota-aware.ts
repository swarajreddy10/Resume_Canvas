import { kv } from '@vercel/kv';

const DAILY_LIMIT = 30_000;

export async function safeKvGet<T>(key: string): Promise<T | null> {
  try {
    const count = await kv.incr('daily_kv_ops');
    if (count > DAILY_LIMIT * 0.9) {
      console.warn(
        JSON.stringify({
          level: 'warn',
          msg: 'KV quota near limit',
          count,
          limit: DAILY_LIMIT,
        })
      );
      return null;
    }
    return await kv.get<T>(key);
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', msg: 'KV get failed', error })
    );
    return null;
  }
}

export async function safeKvSet<T>(
  key: string,
  value: T,
  ttl = 300
): Promise<void> {
  try {
    const count = (await kv.get<number>('daily_kv_ops')) || 0;
    if (count > DAILY_LIMIT * 0.9) {
      console.warn(
        JSON.stringify({
          level: 'warn',
          msg: 'KV quota near limit, skipping write',
          count,
        })
      );
      return;
    }
    await kv.set(key, value, { ex: ttl });
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', msg: 'KV set failed', error })
    );
  }
}

export async function safeKvDel(key: string): Promise<void> {
  try {
    await kv.del(key);
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', msg: 'KV delete failed', error })
    );
  }
}
