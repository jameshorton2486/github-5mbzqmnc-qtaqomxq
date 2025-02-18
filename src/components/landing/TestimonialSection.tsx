import React from 'react';
import { MessageSquare } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}

interface TestimonialSectionProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export function TestimonialSection({ title, subtitle, testimonials }: TestimonialSectionProps) {
  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <MessageSquare className="h-8 w-8 text-purple-500/20 absolute top-6 right-6" />
            <p className="text-gray-300 italic mb-4">{testimonial.quote}</p>
            <div className="flex items-center">
              <img
                src={testimonial.image}
                alt={testimonial.author}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="text-white font-semibold">{testimonial.author}</p>
                <p className="text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}