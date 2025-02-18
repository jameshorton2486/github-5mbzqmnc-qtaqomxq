import React from 'react';
import { FileText, Users, Brain } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  {
    value: '10k+',
    label: 'Depositions',
    icon: <FileText className="h-6 w-6" />
  },
  {
    value: '5k+',
    label: 'Professionals',
    icon: <Users className="h-6 w-6" />
  },
  {
    value: '98%',
    label: 'Accuracy',
    icon: <Brain className="h-6 w-6" />
  }
];

export function HeroStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center justify-center p-4',
            'bg-gray-800/30 backdrop-blur-sm rounded-lg',
            'border border-gray-700/50 hover:border-purple-500/30',
            'transition-all duration-300'
          )}
        >
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mr-3">
              {stat.icon}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}