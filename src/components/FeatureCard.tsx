import React from 'react';
import { Tooltip } from './Tooltip';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  selected = false,
  onClick,
  className = ''
}: FeatureCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <Tooltip content={description} position="top" delay={500}>
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        data-testid={`feature-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={`
          p-6 rounded-xl transition-all duration-200 cursor-pointer
          ${selected
            ? 'bg-purple-600 shadow-lg shadow-purple-500/20'
            : 'bg-gray-800 hover:bg-gray-700'
          }
          ${className}
        `}
      >
        <div className="flex items-center gap-4">
          <div className={`${selected ? 'text-white' : 'text-gray-400'}`}>
            {icon}
          </div>
          <div>
            <h3 className={`font-semibold mb-1 ${selected ? 'text-white' : 'text-gray-200'}`}>
              {title}
            </h3>
            <p className={`text-sm ${selected ? 'text-purple-100' : 'text-gray-400'}`}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}