import { type LogEntry, type LoggerInterface } from './types';
import { formatError, getLogFilename } from './utils';

export class FileLogger implements LoggerInterface {
  private logDir = 'logs';
  private maxFileSize = 10 * 1024 * 1024; // 10MB

  async log(entry: LogEntry): Promise<void> {
    const logFile = `${this.logDir}/${getLogFilename()}`;
    const logString = JSON.stringify({
      ...entry,
      error: entry.error ? formatError(entry.error) : undefined
    }, null, 2);

    try {
      // In a real Node.js environment, we would use fs.appendFile
      // For browser environment, we'll use localStorage as a demo
      const currentLogs = localStorage.getItem(logFile) || '';
      const newLogs = currentLogs + logString + '\n';

      if (new Blob([newLogs]).size > this.maxFileSize) {
        await this.rotate();
      }

      localStorage.setItem(logFile, newLogs);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  async rotate(): Promise<void> {
    const currentDate = new Date();
    const currentFile = getLogFilename(currentDate);
    const archiveFile = `${currentFile}.${Date.now()}.archive`;

    try {
      const currentLogs = localStorage.getItem(`${this.logDir}/${currentFile}`);
      if (currentLogs) {
        localStorage.setItem(`${this.logDir}/${archiveFile}`, currentLogs);
        localStorage.removeItem(`${this.logDir}/${currentFile}`);
      }
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }
}