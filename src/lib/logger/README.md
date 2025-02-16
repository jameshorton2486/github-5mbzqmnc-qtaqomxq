# Logging System

This directory contains a structured logging system for the application.

## Structure

- `index.ts` - Main logger instance and exports
- `types.ts` - TypeScript types and interfaces
- `utils.ts` - Utility functions for logging
- `console-logger.ts` - Development console logging
- `file-logger.ts` - Production file logging

## Usage

```typescript
import { logger } from '@/lib/logger';

// Basic logging
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');

// With context
logger.info('User action', { userId: '123', action: 'login' });

// With error
try {
  // Some code that might throw
} catch (error) {
  logger.error('Operation failed', error as Error, { 
    context: 'additional info' 
  });
}

// Performance tracking
logger.time('operation');
// ... some operation
logger.timeEnd('operation');
```

## Log Rotation

Logs are automatically rotated when they reach 10MB in size. Archive files are created with timestamps.

## Development vs Production

- Development: Logs are output to the console with color coding
- Production: Logs are written to files in the `logs` directory

## Log Format

```json
{
  "timestamp": "2025-02-15T18:30:00.000Z",
  "level": "info",
  "message": "User logged in",
  "context": {
    "userId": "123",
    "ip": "192.168.1.1"
  },
  "theme": "dark"
}
```