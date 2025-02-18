import React, { useState } from 'react';
import { Check, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface PricingTier {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
  cta?: string;
}

interface PricingSectionProps {
  title: string;
  subtitle: string;
  tiers: PricingTier[];
  showAnnual?: boolean;
}

export function PricingSection({ 
  title, 
  subtitle, 
  tiers,
  showAnnual = true 
}: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300 mb-8">{subtitle}</p>

        {showAnnual && (
          <div className="inline-flex items-center bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                !isAnnual 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                isAnnual 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              Annual (Save 20%)
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={cn(
              "relative",
              tier.popular && "md:scale-105 md:-translate-y-2"
            )}
          >
            {tier.popular && (
              <div className="absolute -top-5 left-0 right-0 flex justify-center">
                <div className="bg-purple-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              </div>
            )}

            <div className={cn(
              "h-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-8",
              tier.popular 
                ? "bg-gradient-to-b from-purple-900/50 to-purple-800/30 border-purple-500/20" 
                : "border border-gray-700/50",
              "transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
            )}>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">
                    {isAnnual 
                      ? `$${parseInt(tier.price.replace(/\D/g, '')) * 0.8}` 
                      : tier.price.split('/')[0]
                    }
                  </span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-purple-400 mt-2">
                    Save 20% with annual billing
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.popular ? 'primary' : 'outline'}
                className="w-full group"
                icon={<Calendar className="h-5 w-5" />}
              >
                {tier.cta || 'Start Free Trial'}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-400">
          All plans include a 14-day free trial • No credit card required
        </p>
      </div>
    </div>
  );
}