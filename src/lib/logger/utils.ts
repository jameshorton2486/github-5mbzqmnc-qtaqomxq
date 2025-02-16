import { type LogLevel, type LogEntry, type LogContext } from './types';
import { type Theme } from '../../contexts/ThemeContext';

export function formatLogEntry(
  level: LogLevel,
  message: string,
  theme: Theme,
  context?: LogContext,
  error?: Error
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    error,
    theme
  };
}

export function formatError(error: Error): Record<string, unknown> {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack
  };
}

export function getLogFilename(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`;
}