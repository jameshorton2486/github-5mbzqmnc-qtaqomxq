import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  message,
  type = 'info',
  duration = 5000,
  onClose
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />
  };

  const backgrounds = {
    success: 'bg-green-900/50 border-green-500/50',
    error: 'bg-red-900/50 border-red-500/50',
    info: 'bg-blue-900/50 border-blue-500/50'
  };

  return (
    <div
      role="alert"
      className={`
        fixed bottom-4 right-4 z-50
        flex items-center gap-3 px-4 py-3
        border rounded-lg shadow-lg
        animate-fade-in
        ${backgrounds[type]}
      `}
    >
      {icons[type]}
      <p className="text-white">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  );
}