import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface CTASectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  showDemo?: boolean;
}

export function CTASection({ 
  title, 
  subtitle, 
  buttonText, 
  buttonLink,
  showDemo = true 
}: CTASectionProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show sticky CTA when user has scrolled 25% of the page
      // Hide it when near the bottom to prevent overlap with footer
      setIsSticky(
        scrollPosition > windowHeight * 0.25 && 
        scrollPosition < documentHeight - windowHeight - 100
      );
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main CTA Section */}
      <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl backdrop-blur-sm border border-purple-500/20">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="primary"
            size="lg"
            icon={<Calendar className="h-5 w-5" />}
          >
            <Link to={buttonLink}>{buttonText}</Link>
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
        <p className="mt-4 text-gray-400 text-sm">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>

      {/* Sticky CTA Bar */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 py-4 px-4 transition-all duration-300 transform",
          isSticky ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:block">
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
            <Button 
              variant="primary"
              size="sm"
              icon={<Calendar className="h-4 w-4" />}
              className="whitespace-nowrap"
            >
              <Link to={buttonLink}>{buttonText}</Link>
            </Button>
            {showDemo && (
              <Button 
                variant="outline"
                size="sm"
                icon={<Play className="h-4 w-4" />}
                className="whitespace-nowrap"
              >
                <Link to="/demo">Watch Demo</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}