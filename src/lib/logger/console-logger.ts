import { type LogEntry, type LoggerInterface } from './types';

export class ConsoleLogger implements LoggerInterface {
  private styles = {
    debug: (theme: 'light' | 'dark') => 
      `color: ${theme === 'dark' ? '#9CA3AF' : '#6B7280'}`,
    info: (theme: 'light' | 'dark') => 
      `color: ${theme === 'dark' ? '#93C5FD' : '#60A5FA'}`,
    warn: (theme: 'light' | 'dark') => 
      `color: ${theme === 'dark' ? '#FCD34D' : '#FBBF24'}`,
    error: (theme: 'light' | 'dark') => 
      `color: ${theme === 'dark' ? '#F87171' : '#EF4444'}; font-weight: bold`
  };

  log(entry: LogEntry): void {
    const style = this.styles[entry.level](entry.theme || 'dark');
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();

    console[entry.level === 'debug' ? 'log' : entry.level](
      `%c${entry.level.toUpperCase()} [${timestamp}] ${entry.message}`,
      style,
      entry.context || '',
      entry.error || ''
    );
  }
}