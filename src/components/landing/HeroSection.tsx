import React from 'react';
import { Link } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({
  icon: Icon,
  title,
  subtitle,
  ctaText = "Get Started",
  ctaLink = "/register"
}: HeroSectionProps) {
  return (
    <div className="text-center mb-16">
      <Icon className="h-16 w-16 text-purple-500 mx-auto mb-6" />
      <h1 className="text-5xl font-bold text-white mb-6">
        {title}
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        {subtitle}
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button 
          variant="primary"
          size="lg"
          icon={<Icon className="h-5 w-5" />}
        >
          <Link to={ctaLink}>{ctaText}</Link>
        </Button>
        <Button 
          variant="outline"
          size="lg"
          icon={<Icon className="h-5 w-5" />}
        >
          Watch Demo
        </Button>
      </div>
    </div>
  );
}