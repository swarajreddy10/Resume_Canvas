/**
 * The logger's output, captured from the console method it writes to. Outside
 * development it writes one JSON line per entry.
 */
import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import type { Mock } from 'bun:test';
import { logger } from '@/lib/utils/logger';

type Line = {
  level: string;
  message: string;
  timestamp: string;
  meta?: Record<string, unknown>;
};

let info: Mock<typeof console.info>;
let error: Mock<typeof console.error>;

beforeEach(() => {
  info = spyOn(console, 'info').mockImplementation(() => {});
  error = spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  info.mockRestore();
  error.mockRestore();
});

const lastLine = (spy: Mock<typeof console.info>): Line =>
  JSON.parse(spy.mock.calls[spy.mock.calls.length - 1][0] as string);

describe('logger', () => {
  test('writes a single JSON line with level, message and timestamp', () => {
    logger.info('Resume saved', { resumeId: 'abc' });

    expect(info).toHaveBeenCalledTimes(1);
    const line = lastLine(info);
    expect(line).toMatchObject({
      level: 'info',
      message: 'Resume saved',
      meta: { resumeId: 'abc' },
    });
    expect(new Date(line.timestamp).toISOString()).toBe(line.timestamp);
  });

  test('turns newlines into spaces so a message cannot forge a second entry', () => {
    logger.info('Normal message\n[ERROR] Fake error message\r\nmore');

    expect(lastLine(info).message).toBe(
      'Normal message [ERROR] Fake error message  more'
    );
  });

  test('strips control characters from messages and string metadata', () => {
    logger.info('Message\x00with\x1fcontrol\x7fchars', { user: 'ali\x1bce' });

    const line = lastLine(info);
    expect(line.message).toBe('Messagewithcontrolchars');
    expect(line.meta).toEqual({ user: 'alice' });
  });

  test('truncates messages to 1000 characters', () => {
    logger.info('A'.repeat(2000));

    expect(lastLine(info).message).toHaveLength(1000);
  });

  test('serialises an Error in metadata with a sanitised message', () => {
    logger.error('Request failed', { error: new Error('bad\ninput') });

    const meta = lastLine(error).meta as {
      error: { name: string; message: string; stack: string };
    };
    expect(meta.error.name).toBe('Error');
    expect(meta.error.message).toBe('bad input');
    expect(meta.error.stack).not.toContain('\n');
  });

  test("keeps an Error's cause chain, where an upstream failure says what went wrong", () => {
    const upstream = new Error('400 tool_use_failed');
    const wrapped = new Error('The model request failed', {
      cause: new Error('retry exhausted', { cause: upstream }),
    });
    logger.error('Failed to optimize resume', { error: wrapped });

    const meta = lastLine(error).meta as { error: { cause: string } };
    expect(meta.error.cause).toBe(
      'Error: retry exhausted <- Error: 400 tool_use_failed'
    );
  });

  test('suppresses debug outside development', () => {
    const debug = spyOn(console, 'debug').mockImplementation(() => {});
    try {
      logger.debug('hidden');
      expect(debug).not.toHaveBeenCalled();
    } finally {
      debug.mockRestore();
    }
  });
});
