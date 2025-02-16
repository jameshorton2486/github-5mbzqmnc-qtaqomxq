import { config } from './config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  theme?: 'light' | 'dark';
}

class Logger {
  private static instance: Logger;
  private isDev: boolean;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 1000;

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
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      theme
    };
  }

  private log(entry: LogEntry): void {
    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

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
        debug: `color: ${entry.theme === 'dark' ? '#9CA3AF' : '#6B7280'}`,
        info: `color: ${entry.theme === 'dark' ? '#93C5FD' : '#60A5FA'}`,
        warn: `color: ${entry.theme === 'dark' ? '#FCD34D' : '#FBBF24'}`,
        error: `color: ${entry.theme === 'dark' ? '#F87171' : '#EF4444'}; font-weight: bold`
      };

      console[entry.level === 'debug' ? 'log' : entry.level](
        `%c${entry.level.toUpperCase()} [${new Date().toLocaleTimeString()}] ${entry.message}`,
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

  // Performance tracking
  time(label: string): void {
    if (this.isDev) {
      console.time(label);
      this.debug(`Starting performance measurement: ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.isDev) {
      console.timeEnd(label);
      this.debug(`Ending performance measurement: ${label}`);
    }
  }

  // Get recent logs
  getLogs(count = 100): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  // Clear log buffer
  clearLogs(): void {
    this.logBuffer = [];
  }
}

export const logger = Logger.getInstance();