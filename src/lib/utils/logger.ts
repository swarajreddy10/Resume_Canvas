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

  private log(level: LogLevel, message: string, meta?: LogMeta) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      meta,
    };

    if (level === 'error' && meta?.error instanceof Error) {
      entry.stack = meta.error.stack;
    }

    const logFn = console[level] || console.log;

    if (this.isDevelopment) {
      logFn(`[${level.toUpperCase()}]`, message, meta || '');
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
