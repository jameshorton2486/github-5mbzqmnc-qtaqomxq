import { logger } from './logger';
import { type Theme } from '../contexts/ThemeContext';

interface ErrorMetadata {
  code?: string;
  userId?: string;
  path?: string;
  theme?: Theme;
  [key: string]: unknown;
}

export class AppError extends Error {
  code: string;
  metadata?: ErrorMetadata;

  constructor(message: string, code: string, metadata?: ErrorMetadata) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.metadata = {
      ...metadata,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    };
  }

  static fromError(error: Error, code: string, metadata?: ErrorMetadata): AppError {
    const appError = new AppError(error.message, code, metadata);
    appError.stack = error.stack;
    return appError;
  }
}

export function handleError(error: unknown, metadata?: ErrorMetadata): void {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const enrichedMetadata = { ...metadata, theme };

  if (error instanceof AppError) {
    logger.error(error.message, error, { 
      code: error.code, 
      ...error.metadata, 
      ...enrichedMetadata 
    });
  } else if (error instanceof Error) {
    logger.error(error.message, error, enrichedMetadata);
  } else {
    logger.error('An unknown error occurred', new Error(String(error)), enrichedMetadata);
  }
}

export function handleErrorBoundary(error: Error, errorInfo: React.ErrorInfo): void {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  
  logger.error('React Error Boundary caught an error', error, {
    componentStack: errorInfo.componentStack,
    theme
  });
}

// Development utilities
if (import.meta.env.DEV) {
  (window as any).__DEBUG__ = {
    logger,
    throwTestError: () => {
      throw new AppError('Test error', 'TEST_ERROR', {
        context: 'Debug utility'
      });
    }
  };
}