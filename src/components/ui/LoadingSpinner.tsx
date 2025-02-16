import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-purple-500 ${sizes[size]}`} />
      <div className={`absolute top-0 left-0 animate-spin rounded-full border-t-2 border-b-2 border-purple-500/30 ${sizes[size]}`} />
    </div>
  );
}