import { config } from './config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private isDev: boolean;

  private constructor() {
    this.isDev = config.server.isDev;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLogEntry(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error
    };
  }

  private log(entry: LogEntry): void {
    const logString = JSON.stringify(entry, (key, value) => {
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack
        };
      }
      return value;
    }, 2);

    // In development, use console methods with appropriate styling
    if (this.isDev) {
      const styles = {
        debug: 'color: #6B7280',
        info: 'color: #60A5FA',
        warn: 'color: #FBBF24',
        error: 'color: #EF4444; font-weight: bold'
      };

      console[entry.level === 'debug' ? 'log' : entry.level](
        `%c${entry.level.toUpperCase()} ${entry.message}`,
        styles[entry.level],
        entry.context || '',
        entry.error || ''
      );
      return;
    }

    // In production, output structured logs
    console[entry.level === 'debug' ? 'log' : entry.level](logString);
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDev) {
      this.log(this.formatLogEntry('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    this.log(this.formatLogEntry('info', message, context));
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.log(this.formatLogEntry('warn', message, context, error));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log(this.formatLogEntry('error', message, context, error));
  }

  // Track performance
  time(label: string): void {
    if (this.isDev) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDev) {
      console.timeEnd(label);
    }
  }
}

export const logger = Logger.getInstance();