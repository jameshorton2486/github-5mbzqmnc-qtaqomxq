import { type Theme } from '../../contexts/ThemeContext';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogContext = Record<string, unknown>;

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  theme?: Theme;
}

export interface LoggerInterface {
  log(entry: LogEntry): void | Promise<void>;
}