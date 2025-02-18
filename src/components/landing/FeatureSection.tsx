import React from 'react';
import { type LucideIcon, Star } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
}

interface FeatureSectionProps {
  features: Feature[];
}

export function FeatureSection({ features }: FeatureSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
            <Icon className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-300 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center text-gray-400">
                  <Star className="h-4 w-4 text-purple-500 mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}