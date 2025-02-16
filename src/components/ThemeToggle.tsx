import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/Button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      size="sm"
      className="relative w-10 h-10 p-0"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className={`h-5 w-5 transition-all ${
        theme === 'light' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
      }`} />
      <Moon className={`absolute h-5 w-5 transition-all ${
        theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}