import { test, expect, describe } from 'bun:test';
import { logger } from '@/lib/utils/logger';

describe('Logger', () => {
  test('logger has info method', () => {
    expect(typeof logger.info).toBe('function');
  });

  test('logger has error method', () => {
    expect(typeof logger.error).toBe('function');
  });

  test('logger has warn method', () => {
    expect(typeof logger.warn).toBe('function');
  });

  test('logger has debug method', () => {
    expect(typeof logger.debug).toBe('function');
  });

  test('info logs without error', () => {
    expect(() => logger.info('test message')).not.toThrow();
  });

  test('error logs without error', () => {
    expect(() => logger.error('test error')).not.toThrow();
  });

  test('warn logs without error', () => {
    expect(() => logger.warn('test warning')).not.toThrow();
  });

  test('debug logs without error', () => {
    expect(() => logger.debug('test debug')).not.toThrow();
  });

  test('logs with metadata', () => {
    expect(() => logger.info('test', { key: 'value' })).not.toThrow();
  });

  test('logs with error object', () => {
    const error = new Error('test error');
    expect(() => logger.error('error occurred', { error })).not.toThrow();
  });
});
