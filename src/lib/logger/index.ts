import { config } from '../config';
import { type Theme } from '../../contexts/ThemeContext';
import { formatLogEntry } from './utils';
import { type LogLevel, type LogEntry, type LogContext } from './types';
import { FileLogger } from './file-logger';
import { ConsoleLogger } from './console-logger';

class Logger {
  private static instance: Logger;
  private isDev: boolean;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 1000;
  private fileLogger: FileLogger;
  private consoleLogger: ConsoleLogger;

  private constructor() {
    this.isDev = config.server.isDev;
    this.fileLogger = new FileLogger();
    this.consoleLogger = new ConsoleLogger();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async log(level: LogLevel, message: string, context?: LogContext, error?: Error): Promise<void> {
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const entry = formatLogEntry(level, message, theme, context, error);

    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Log to console in development
    if (this.isDev) {
      this.consoleLogger.log(entry);
    }

    // Log to file in production
    if (!this.isDev) {
      await this.fileLogger.log(entry);
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDev) {
      void this.log('debug', message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    void this.log('info', message, context);
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    void this.log('warn', message, context, error);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    void this.log('error', message, context, error);
  }

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

  getLogs(count = 100): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  clearLogs(): void {
    this.logBuffer = [];
  }

  async rotateLogs(): Promise<void> {
    await this.fileLogger.rotate();
  }
}

export const logger = Logger.getInstance();
export type { LogLevel, LogEntry, LogContext } from './types';