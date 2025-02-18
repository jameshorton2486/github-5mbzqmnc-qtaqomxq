import React from 'react';
import { Video, Cloud, Zap, Volume2, Clock, HardDrive, Settings } from 'lucide-react';
import { HeroSection } from '../../components/landing/HeroSection';
import { FeatureSection } from '../../components/landing/FeatureSection';
import { TestimonialSection } from '../../components/landing/TestimonialSection';
import { PricingSection } from '../../components/landing/PricingSection';
import { FAQSection } from '../../components/landing/FAQSection';
import { CTASection } from '../../components/landing/CTASection';

export function VideographerLanding() {
  const features = [
    {
      icon: Cloud,
      title: 'Cloud Storage & Delivery',
      description: 'Secure cloud storage with instant delivery options for all stakeholders.',
      benefits: [
        'Automatic backup',
        'Secure sharing',
        'Instant delivery'
      ]
    },
    {
      icon: Zap,
      title: 'Quality Control',
      description: 'AI-powered quality control ensures perfect synchronization and clarity.',
      benefits: [
        'Auto-sync verification',
        'Quality monitoring',
        'Error detection'
      ]
    },
    {
      icon: Volume2,
      title: 'Audio Enhancement',
      description: 'Professional audio tools for crystal-clear sound quality.',
      benefits: [
        'Noise reduction',
        'Voice enhancement',
        'Audio balancing'
      ]
    }
  ];

  const testimonials = [
    {
      quote: "The automatic synchronization and quality control features have transformed my workflow. What used to take hours now takes minutes.",
      author: "Michael Chen",
      role: "Legal Videographer, 12+ years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"
    },
    {
      quote: "The cloud storage and instant delivery options have made my life so much easier. My clients love how quickly they receive their videos.",
      author: "Sarah Johnson",
      role: "Freelance Legal Videographer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100"
    }
  ];

  const pricingTiers = [
    {
      name: "Basic",
      price: "$99/month",
      features: [
        "5 depositions per month",
        "Basic cloud storage",
        "Standard quality control",
        "Email support"
      ]
    },
    {
      name: "Professional",
      price: "$199/month",
      popular: true,
      features: [
        "Unlimited depositions",
        "Advanced cloud storage",
        "Premium quality control",
        "Priority support",
        "Custom branding"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Custom storage limits",
        "Dedicated support",
        "API access",
        "Custom integrations",
        "Training & onboarding"
      ]
    }
  ];

  const faqs = [
    {
      question: "What video formats are supported?",
      answer: "We support all major video formats including MP4, MOV, AVI, and more. Our system automatically optimizes files for delivery."
    },
    {
      question: "How secure is the cloud storage?",
      answer: "We use enterprise-grade encryption and maintain multiple backups. Your videos are protected with bank-level security."
    },
    {
      question: "Can I use my existing equipment?",
      answer: "Yes, our platform works with most professional video equipment. We provide detailed compatibility guides and support."
    },
    {
      question: "How long does processing take?",
      answer: "Most videos are processed and synchronized within minutes. Longer recordings may take up to an hour for full enhancement."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <HeroSection
          icon={Video}
          title="Seamlessly Sync Videos with Transcripts"
          subtitle="Deliver high-quality, timestamped videos with AI-powered enhancements and cloud-based storage."
          ctaText="Explore Features"
        />

        <FeatureSection features={features} />

        {/* Comparison Table */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our Platform</h2>
            <p className="text-gray-300">See how we compare to traditional methods</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Traditional Method</h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-400">
                  <Clock className="h-5 w-5 mr-2 mt-1 text-gray-500" />
                  Manual synchronization takes hours
                </li>
                <li className="flex items-start text-gray-400">
                  <HardDrive className="h-5 w-5 mr-2 mt-1 text-gray-500" />
                  Local storage only
                </li>
                <li className="flex items-start text-gray-400">
                  <Settings className="h-5 w-5 mr-2 mt-1 text-gray-500" />
                  Limited quality control
                </li>
              </ul>
            </div>
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-6 transform scale-105 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Our Platform</h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-200">
                  <Clock className="h-5 w-5 mr-2 mt-1 text-purple-500" />
                  Automatic sync in minutes
                </li>
                <li className="flex items-start text-gray-200">
                  <Cloud className="h-5 w-5 mr-2 mt-1 text-purple-500" />
                  Secure cloud storage
                </li>
                <li className="flex items-start text-gray-200">
                  <Zap className="h-5 w-5 mr-2 mt-1 text-purple-500" />
                  AI-powered quality control
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Time Savings</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-500 mb-2">80%</div>
                  <p className="text-gray-300">Faster Processing</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-500 mb-2">95%</div>
                  <p className="text-gray-300">Error Reduction</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-500 mb-2">100%</div>
                  <p className="text-gray-300">Cloud Backup</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TestimonialSection
          title="What Videographers Say"
          subtitle="Hear from professionals using our platform"
          testimonials={testimonials}
        />

        <PricingSection
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that fits your needs"
          tiers={pricingTiers}
        />

        <FAQSection
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions"
          faqs={faqs}
        />

        <CTASection
          title="Get Started Today"
          subtitle="Start delivering better videos faster. No credit card required."
          buttonText="Get Started Today"
          buttonLink="/register"
        />
      </div>
    </div>
  );
}