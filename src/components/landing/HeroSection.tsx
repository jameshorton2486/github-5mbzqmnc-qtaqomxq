import React from 'react';
import { Link } from 'react-router-dom';
import { type LucideIcon, Calendar, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface HeroSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  showDemo?: boolean;
  className?: string;
}

export function HeroSection({
  icon: Icon,
  title,
  subtitle,
  ctaText = "Start Free Trial",
  ctaLink = "/register",
  showDemo = true,
  className
}: HeroSectionProps) {
  return (
    <div className={cn("text-center mb-16", className)}>
      <div className="relative inline-block mb-6 group">
        {/* Animated glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-lg rounded-full group-hover:opacity-30 transition-opacity duration-300" />
        <Icon className="relative h-16 w-16 text-purple-500 transition-transform duration-300 group-hover:scale-110" />
      </div>

      <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
        {title}
      </h1>
      
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
        {subtitle}
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <Button 
          variant="primary"
          size="lg"
          icon={<Calendar className="h-5 w-5" />}
          className="group"
        >
          <Link to={ctaLink} className="flex items-center">
            {ctaText}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
        {showDemo && (
          <Button 
            variant="outline"
            size="lg"
            icon={<Play className="h-5 w-5" />}
          >
            <Link to="/demo">Watch Demo</Link>
          </Button>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          4.9/5 Average Rating
        </div>
        <div>
          <span className="font-semibold text-white">10,000+</span> Legal Professionals
        </div>
        <div>
          <span className="font-semibold text-white">99.9%</span> Uptime
        </div>
        <div>
          <span className="font-semibold text-white">HIPAA</span> Compliant
        </div>
      </div>
    </div>
  );
}