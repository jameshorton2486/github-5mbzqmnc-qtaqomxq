import { logger } from './logger';

interface ErrorMetadata {
  code?: string;
  userId?: string;
  path?: string;
  [key: string]: unknown;
}

export class AppError extends Error {
  code: string;
  metadata?: ErrorMetadata;

  constructor(message: string, code: string, metadata?: ErrorMetadata) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.metadata = metadata;
  }
}

export function handleError(error: unknown, metadata?: ErrorMetadata): void {
  if (error instanceof AppError) {
    logger.error(error.message, error, { code: error.code, ...error.metadata, ...metadata });
  } else if (error instanceof Error) {
    logger.error(error.message, error, metadata);
  } else {
    logger.error('An unknown error occurred', new Error(String(error)), metadata);
  }
}

// React error boundary handler
export function handleErrorBoundary(error: Error, errorInfo: React.ErrorInfo): void {
  logger.error('React Error Boundary caught an error', error, {
    componentStack: errorInfo.componentStack
  });
}