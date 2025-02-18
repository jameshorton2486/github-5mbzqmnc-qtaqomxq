import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Edit, 
  GitMerge, 
  MessageSquare, 
  Clock,
  ArrowRight,
  Play,
  FileText,
  Wand2,
  ClipboardCheck,
  BookOpen,
  CheckCircle,
  ListChecks,
  Shield,
  Cloud,
  Zap
} from 'lucide-react';
import { HeroSection } from '../../components/landing/HeroSection';
import { FeatureSection } from '../../components/landing/FeatureSection';
import { TestimonialSection } from '../../components/landing/TestimonialSection';
import { PricingSection } from '../../components/landing/PricingSection';
import { FAQSection } from '../../components/landing/FAQSection';
import { CTASection } from '../../components/landing/CTASection';

export function CourtReporterLanding() {
  const features = [
    {
      icon: Edit,
      title: 'Live Transcript Editing',
      description: 'Edit transcripts in real-time with instant corrections and AI-powered suggestions.',
      benefits: [
        'Real-time editing capabilities',
        'AI-powered error detection',
        'Instant collaboration'
      ]
    },
    {
      icon: Brain,
      title: 'Pre-Recorded File Transcription',
      description: 'Convert audio and video files to accurate transcripts with our advanced AI model.',
      benefits: [
        'Industry-leading accuracy',
        'Multiple format support',
        'Fast turnaround time'
      ]
    },
    {
      icon: GitMerge,
      title: 'Audio-Text Synchronization',
      description: 'Perfect synchronization between audio, video, and transcript content.',
      benefits: [
        'Click-to-play functionality',
        'Automatic timestamping',
        'Multi-device sync'
      ]
    },
    {
      icon: ClipboardCheck,
      title: 'Certification Tools',
      description: 'Comprehensive tools for transcript certification and delivery.',
      benefits: [
        'Digital certification',
        'Automated formatting',
        'Secure delivery'
      ]
    }
  ];

  const testimonials = [
    {
      quote: "The AI-powered transcription and real-time editing features have revolutionized my workflow. I'm completing depositions in half the time with even better accuracy.",
      author: "Sarah Martinez",
      role: "Certified Court Reporter, 15+ years",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100"
    },
    {
      quote: "The audio-text synchronization is a game-changer. Being able to click any word and instantly hear the audio has made verification and corrections incredibly efficient.",
      author: "Michael Thompson",
      role: "Senior Court Reporter",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"
    }
  ];

  const pricingTiers = [
    {
      name: "Basic",
      price: "$99/month",
      features: [
        "Up to 20 hours of transcription",
        "Real-time editing",
        "Basic AI assistance",
        "Standard support",
        "Cloud storage (50GB)",
        "Email support"
      ]
    },
    {
      name: "Professional",
      price: "$199/month",
      popular: true,
      features: [
        "Unlimited transcription",
        "Advanced AI features",
        "Priority support",
        "Cloud storage (500GB)",
        "Custom templates",
        "Phone & email support",
        "Team collaboration",
        "Analytics dashboard"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Custom transcription volume",
        "Dedicated support team",
        "Custom AI training",
        "Unlimited storage",
        "API access",
        "Custom integrations",
        "Advanced analytics",
        "SLA guarantee"
      ]
    }
  ];

  const faqs = [
    {
      question: "What accuracy rate can I expect from the AI transcription?",
      answer: "Our AI model achieves a 98.5% accuracy rate for clear audio, with human review bringing it to 99.9%. The system continuously learns and improves from corrections."
    },
    {
      question: "How secure is my data?",
      answer: "We use bank-level encryption (AES-256) for all data, both in transit and at rest. Our platform is HIPAA compliant and follows strict data protection protocols."
    },
    {
      question: "Can I use my existing stenography equipment?",
      answer: "Yes, our platform integrates seamlessly with most modern CAT software and stenography machines. We provide detailed compatibility guides and support."
    },
    {
      question: "What file formats are supported for pre-recorded transcription?",
      answer: "We support all major audio and video formats including MP3, WAV, MP4, MOV, and many more. Files can be uploaded directly or imported from cloud storage."
    },
    {
      question: "How does the real-time collaboration work?",
      answer: "Multiple team members can access and edit transcripts simultaneously, with changes synced in real-time. Our version control system tracks all modifications."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide email support for all plans, with Professional and Enterprise plans including priority phone support and dedicated account managers."
    },
    {
      question: "Can I try the platform before committing?",
      answer: "Yes, we offer a 14-day free trial with full access to all Professional plan features. No credit card required to start."
    },
    {
      question: "How do you handle technical issues during live depositions?",
      answer: "Our platform includes automatic backup and redundancy features. Professional and Enterprise plans include emergency technical support during live sessions."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <HeroSection
          icon={Brain}
          title="Seamlessly Manage Depositions with AI-Powered Tools"
          subtitle="Accurate, real-time and prerecorded transcripts, enhanced accuracy with our own model, synchronized video, and cloud-based storage—all in one platform."
          ctaText="Start Free Trial"
        />

        <FeatureSection features={features} />

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Transform Your Workflow</h2>
            <p className="text-xl text-gray-300">Experience the power of AI-assisted court reporting</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <Clock className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">50% Time Savings</h3>
              <p className="text-gray-400">Complete transcripts in half the time with AI assistance</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <CheckCircle className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">99.9% Accuracy</h3>
              <p className="text-gray-400">Industry-leading accuracy with AI and human review</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <Zap className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Instant Delivery</h3>
              <p className="text-gray-400">Secure, immediate transcript delivery to all parties</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <Cloud className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Cloud Storage</h3>
              <p className="text-gray-400">Secure, unlimited storage for all your transcripts</p>
            </div>
          </div>
        </div>

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
                  Manual transcription and editing
                </li>
                <li className="flex items-start text-gray-400">
                  <FileText className="h-5 w-5 mr-2 mt-1 text-gray-500" />
                  Physical file storage
                </li>
                <li className="flex items-start text-gray-400">
                  <MessageSquare className="h-5 w-5 mr-2 mt-1 text-gray-500" />
                  Limited collaboration
                </li>
                <li className="flex items-start text-gray-400">
                  <Shield className="h-5 w-5 mr-2 mt-1 text-gray-500" />
                  Basic security
                </li>
              </ul>
            </div>
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-6 transform scale-105 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Bolt AI Platform</h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-200">
                  <Brain className="h-5 w-5 mr-2 mt-1 text-purple-500" />
                  AI-powered transcription
                </li>
                <li className="flex items-start text-gray-200">
                  <Cloud className="h-5 w-5 mr-2 mt-1 text-purple-500" />
                  Secure cloud storage
                </li>
                <li className="flex items-start text-gray-200">
                  <Zap className="h-5 w-5 mr-2 mt-1 text-purple-500" />
                  Real-time collaboration
                </li>
                <li className="flex items-start text-gray-200">
                  <Shield className="h-5 w-5 mr-2 mt-1 text-purple-500" />
                  Enterprise-grade security
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">The Results</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-500 mb-2">50%</div>
                  <p className="text-gray-300">Faster Completion</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-500 mb-2">99.9%</div>
                  <p className="text-gray-300">Accuracy Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-500 mb-2">100%</div>
                  <p className="text-gray-300">Digital Storage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TestimonialSection
          title="Trusted by Court Reporters"
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
          title="Ready to Transform Your Workflow?"
          subtitle="Start your 14-day free trial today. No credit card required."
          buttonText="Start Free Trial"
          buttonLink="/register"
        />
      </div>
    </div>
  );
}