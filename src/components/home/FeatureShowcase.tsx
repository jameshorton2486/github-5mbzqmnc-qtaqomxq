import React from 'react';
import { Zap, Clock, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats: {
    value: string;
    label: string;
  };
}

const features: Feature[] = [
  {
    title: 'AI-Powered Efficiency',
    description: 'Reduce transcription time and improve accuracy with advanced AI assistance.',
    icon: <Zap className="h-6 w-6" />,
    stats: {
      value: '60%',
      label: 'Faster Processing'
    }
  },
  {
    title: 'Real-Time Collaboration',
    description: 'Work seamlessly with your team in real-time across all devices.',
    icon: <Users className="h-6 w-6" />,
    stats: {
      value: '100%',
      label: 'Team Sync'
    }
  },
  {
    title: 'Quick Turnaround',
    description: 'Get your transcripts faster with automated workflows and quality control.',
    icon: <Clock className="h-6 w-6" />,
    stats: {
      value: '24h',
      label: 'Average Delivery'
    }
  }
];

export function FeatureShowcase() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose Depo-Pro
          </h2>
          <p className="text-xl text-gray-400">
            Streamline your deposition workflow with cutting-edge features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'bg-gray-800/50 backdrop-blur-sm rounded-lg p-8',
                'border border-gray-700/50 hover:border-purple-500/30',
                'transition-all duration-300'
              )}
            >
              <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-6">
                {feature.description}
              </p>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-purple-500">
                  {feature.stats.value}
                </div>
                <div className="ml-2 text-sm text-gray-400">
                  {feature.stats.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}