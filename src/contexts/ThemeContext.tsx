import React, { createContext, useContext, useEffect, useState } from 'react';
import { logger } from '../lib/logger';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      // Check for saved theme preference
      const saved = localStorage.getItem('theme') as Theme;
      logger.debug('Initial theme loaded', { saved });
      return saved || 'dark';
    } catch (error) {
      logger.warn('Failed to load theme preference', {}, error as Error);
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      // Update localStorage and document class when theme changes
      localStorage.setItem('theme', theme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      
      logger.info('Theme changed', { theme });
    } catch (error) {
      logger.error('Failed to update theme', error as Error);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    try {
      logger.debug('Theme change requested', { 
        from: theme, 
        to: newTheme 
      });
      
      setTheme(newTheme);
    } catch (error) {
      logger.error('Failed to change theme', error as Error, {
        requestedTheme: newTheme
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new AppError(
      'useTheme must be used within a ThemeProvider',
      'THEME_CONTEXT_ERROR'
    );
  }
  return context;
}