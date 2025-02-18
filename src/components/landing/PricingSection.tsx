import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface PricingTier {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

interface PricingSectionProps {
  title: string;
  subtitle: string;
  tiers: PricingTier[];
}

export function PricingSection({ title, subtitle, tiers }: PricingSectionProps) {
  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`${
              tier.popular
                ? 'bg-gradient-to-b from-purple-900/50 to-purple-800/30 transform scale-105 shadow-xl'
                : 'bg-gray-800/50'
            } backdrop-blur-sm rounded-lg p-6`}
          >
            {tier.popular && (
              <div className="bg-purple-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
            <p className="text-3xl font-bold text-white mb-4">{tier.price}</p>
            <ul className="space-y-3 mb-6">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={tier.popular ? 'primary' : 'outline'}
              className="w-full"
            >
              Start Free Trial
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}