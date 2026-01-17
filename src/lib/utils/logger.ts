/**
 * Structured Logging Utility
 * Provides consistent logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LogMeta = Record<string, any>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  meta?: LogMeta;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private sanitizeForLog(input: string): string {
    return input
      .replace(/[\r\n]/g, ' ') // Remove newlines
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
      .substring(0, 1000); // Limit length
  }

  private sanitizeMeta(meta?: LogMeta): LogMeta | undefined {
    if (!meta) return meta;

    const sanitized: LogMeta = {};
    for (const [key, value] of Object.entries(meta)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeForLog(value);
      } else if (value instanceof Error) {
        sanitized[key] = {
          name: value.name,
          message: this.sanitizeForLog(value.message),
          stack: value.stack ? this.sanitizeForLog(value.stack) : undefined,
        };
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private log(level: LogLevel, message: string, meta?: LogMeta) {
    const sanitizedMessage = this.sanitizeForLog(message);
    const sanitizedMeta = this.sanitizeMeta(meta);

    const entry: LogEntry = {
      level,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
      meta: sanitizedMeta,
    };

    if (level === 'error' && sanitizedMeta?.error instanceof Error) {
      entry.stack = sanitizedMeta.error.stack;
    }

    const logFn = console[level] || console.log;

    if (this.isDevelopment) {
      logFn(`[${level.toUpperCase()}]`, sanitizedMessage, sanitizedMeta || '');
    } else {
      logFn(JSON.stringify(entry));
    }
  }

  debug(message: string, meta?: LogMeta) {
    if (this.isDevelopment) {
      this.log('debug', message, meta);
    }
  }

  info(message: string, meta?: LogMeta) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: LogMeta) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: LogMeta) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger();
