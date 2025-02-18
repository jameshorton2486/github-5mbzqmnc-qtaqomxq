import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface CTASectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export function CTASection({ title, subtitle, buttonText, buttonLink }: CTASectionProps) {
  return (
    <div className="text-center">
      <Button 
        variant="primary"
        size="lg"
        icon={<ArrowRight className="h-5 w-5" />}
      >
        <Link to={buttonLink}>{buttonText}</Link>
      </Button>
      <p className="mt-4 text-gray-400">{subtitle}</p>
    </div>
  );
}