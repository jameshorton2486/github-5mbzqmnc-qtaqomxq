import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  History, 
  ArrowRight, 
  Star, 
  Play, 
  Check, 
  MessageSquare,
  GitBranch,
  FileText,
  Zap,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ScopistLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Users className="h-16 w-16 text-purple-500 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            Collaborate Efficiently with AI-Powered Editing Tools
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ensure accuracy with version control, track changes, and access integrated reference materials.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              variant="primary"
              size="lg"
              icon={<ArrowRight className="h-5 w-5" />}
            >
              <Link to="/register">Start Free Trial</Link>
            </Button>
            <Button 
              variant="outline"
              size="lg"
              icon={<Play className="h-5 w-5" />}
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
            <GitBranch className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Version Control</h3>
            <p className="text-gray-300 mb-4">
              Track every change with advanced version control and collaboration tools.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Change tracking
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Version comparison
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Revision history
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
            <BookOpen className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Reference Library</h3>
            <p className="text-gray-300 mb-4">
              Access comprehensive reference materials and style guides.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Legal dictionaries
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Style guides
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Term databases
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
            <Users className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Collaboration</h3>
            <p className="text-gray-300 mb-4">
              Work seamlessly with court reporters and other team members.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Real-time editing
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Comment system
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Task management
              </li>
            </ul>
          </div>
        </div>

        {/* Collaboration Demo */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Real-Time Collaboration</h2>
            <p className="text-gray-300">See how multiple users can edit and review transcripts together</p>
          </div>
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            <Play className="h-16 w-16 text-purple-500" />
          </div>
        </div>

        {/* Workflow Benefits */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Transform Your Workflow</h2>
            <p className="text-gray-300">How our platform improves your efficiency</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <Clock className="h-8 w-8 text-purple-500 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Save Time</h4>
              <p className="text-gray-400">Reduce editing time by up to 50% with AI assistance</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <FileText className="h-8 w-8 text-purple-500 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Improve Accuracy</h4>
              <p className="text-gray-400">Maintain consistency with integrated style guides</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <Zap className="h-8 w-8 text-purple-500 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Work Faster</h4>
              <p className="text-gray-400">Streamline your workflow with automated tools</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <Users className="h-8 w-8 text-purple-500 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Collaborate</h4>
              <p className="text-gray-400">Work seamlessly with your team in real-time</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">What Scopists Say</h2>
            <p className="text-gray-300">Hear from professionals using our platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <MessageSquare className="h-8 w-8 text-purple-500/20 absolute top-6 right-6" />
              <p className="text-gray-300 italic mb-4">
                "The version control and reference tools have revolutionized how I work. I can focus on accuracy while the platform handles organization."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100"
                  alt="Professional Scopist"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-white font-semibold">Emily Rodriguez</p>
                  <p className="text-gray-400">Senior Scopist, 8+ years</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <MessageSquare className="h-8 w-8 text-purple-500/20 absolute top-6 right-6" />
              <p className="text-gray-300 italic mb-4">
                "The collaboration features make working with court reporters seamless. The integrated reference library is invaluable."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"
                  alt="Professional Scopist"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-white font-semibold">David Chen</p>
                  <p className="text-gray-400">Freelance Scopist</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-300">Choose the plan that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Basic</h3>
              <p className="text-3xl font-bold text-white mb-4">$49<span className="text-sm text-gray-400">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  Basic version control
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  Standard reference library
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  Email support
                </li>
              </ul>
              <Button variant="outline" className="w-full">Start Free Trial</Button>
            </div>
            <div className="bg-gradient-to-b from-purple-900/50 to-purple-800/30 backdrop-blur-sm rounded-lg p-6 transform scale-105 shadow-xl">
              <div className="bg-purple-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">Most Popular</div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional</h3>
              <p className="text-3xl font-bold text-white mb-4">$99<span className="text-sm text-gray-300">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2" />
                  Advanced version control
                </li>
                <li className="flex items-center text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2" />
                  Full reference library
                </li>
                <li className="flex items-center text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2" />
                  Team collaboration
                </li>
              </ul>
              <Button variant="primary" className="w-full">Start Free Trial</Button>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
              <p className="text-3xl font-bold text-white mb-4">Custom</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  Custom workflows
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  Dedicated support
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  API access
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  Custom integrations
                </li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-300">Find answers to common questions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">How does version control work?</h4>
              <p className="text-gray-300">Our system tracks every change, allowing you to review, compare, and restore previous versions easily.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Can I use my own reference materials?</h4>
              <p className="text-gray-300">Yes, you can upload and integrate your own reference materials alongside our comprehensive library.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">How does team collaboration work?</h4>
              <p className="text-gray-300">Multiple team members can work on the same transcript simultaneously, with changes synced in real-time.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Is training provided?</h4>
              <p className="text-gray-300">Yes, we offer comprehensive training and ongoing support to help you make the most of our platform.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <Button 
            variant="primary"
            size="lg"
            icon={<ArrowRight className="h-5 w-5" />}
          >
            <Link to="/register">Start Editing Now</Link>
          </Button>
          <p className="mt-4 text-gray-400">
            14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}