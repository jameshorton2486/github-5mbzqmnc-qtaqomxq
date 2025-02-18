import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { type LucideIcon, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface RoleFeaturePanelProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  href: string;
  className?: string;
}

export function RoleFeaturePanel({
  icon: Icon,
  title,
  description,
  features,
  href,
  className
}: RoleFeaturePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        'group bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden',
        'border border-gray-700/50 hover:border-purple-500/50',
        'transition-all duration-300 hover:bg-gray-800/70',
        'transform hover:scale-[1.02]',
        'hover:shadow-lg hover:shadow-purple-500/10',
        className
      )}
    >
      {/* Main Content */}
      <div 
        className="p-8 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex justify-between items-start">
          <div className="relative">
            {/* Icon with animated background glow */}
            <div className="absolute -inset-1 bg-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Icon className="relative h-12 w-12 text-purple-500 mb-6 transition-transform duration-300 group-hover:scale-110" />
          </div>
          
          <ChevronDown 
            className={cn(
              "h-6 w-6 text-purple-500 transition-transform duration-300",
              isExpanded ? "rotate-180" : ""
            )}
          />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 mb-6">{description}</p>
        
        {/* Preview Features */}
        <ul className="space-y-3">
          {features.slice(0, isExpanded ? features.length : 2).map((feature, index) => (
            <li 
              key={index}
              className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-3" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Expanded Content */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-8 pt-0">
          {/* Additional Features */}
          <ul className="space-y-3 border-t border-gray-700/50 pt-6">
            {features.slice(2).map((feature, index) => (
              <li 
                key={index}
                className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-3" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Learn More Link */}
          <Link
            to={href}
            className="mt-6 inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            Learn more
            <svg 
              className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}