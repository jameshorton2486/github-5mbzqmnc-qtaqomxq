import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Brain, Video, ArrowRight, Star, Check, Play, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AttorneyLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <FileText className="h-16 w-16 text-purple-500 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            Streamline Your Deposition Workflow
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powerful tools designed specifically for attorneys to manage exhibits, review transcripts, and leverage AI assistance during depositions.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              variant="primary"
              size="lg"
              icon={<ArrowRight className="h-5 w-5" />}
            >
              <Link to="/register">Get Started Today</Link>
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
            <FileText className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Digital Exhibit Management</h3>
            <p className="text-gray-300 mb-4">
              Seamlessly organize, present, and share exhibits during depositions with our intuitive digital tools.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Real-time exhibit sharing
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Secure document storage
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Quick exhibit marking
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
            <Brain className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Assistance</h3>
            <p className="text-gray-300 mb-4">
              Let AI help you conduct more effective depositions with real-time insights and suggestions.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Smart question suggestions
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Document analysis
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Real-time fact checking
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
            <Video className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Video Integration</h3>
            <p className="text-gray-300 mb-4">
              Create compelling video presentations from your transcripts for maximum impact in court.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Automated video creation
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Custom clip selection
              </li>
              <li className="flex items-center text-gray-400">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Professional editing tools
              </li>
            </ul>
          </div>
        </div>

        {/* Video Demo Section */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">See It in Action</h2>
            <p className="text-gray-300">Watch how our platform streamlines your deposition workflow</p>
          </div>
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            <Play className="h-16 w-16 text-purple-500" />
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Leading Law Firms</h2>
            <p className="text-gray-300">Here's what attorneys are saying about our platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <p className="text-gray-300 italic mb-4">
                "This platform has revolutionized how we handle depositions. The AI assistance and exhibit management are game-changers."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"
                  alt="Attorney"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-white font-semibold">John Smith</p>
                  <p className="text-gray-400">Senior Partner, Smith & Associates</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <p className="text-gray-300 italic mb-4">
                "The efficiency gains are remarkable. We've reduced our preparation time by 50% while improving our effectiveness."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100"
                  alt="Attorney"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-white font-semibold">Sarah Johnson</p>
                  <p className="text-gray-400">Managing Partner, Johnson Law Group</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-300">Choose the plan that's right for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Solo Practice</h3>
              <p className="text-3xl font-bold text-white mb-4">$99<span className="text-sm text-gray-400">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  All core features
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  5 depositions/month
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  Basic AI assistance
                </li>
              </ul>
              <Button variant="outline" className="w-full">Start Free Trial</Button>
            </div>
            <div className="bg-gradient-to-b from-purple-900/50 to-purple-800/30 backdrop-blur-sm rounded-lg p-6 transform scale-105 shadow-xl">
              <div className="bg-purple-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">Most Popular</div>
              <h3 className="text-xl font-semibold text-white mb-2">Small Firm</h3>
              <p className="text-3xl font-bold text-white mb-4">$299<span className="text-sm text-gray-300">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2" />
                  Everything in Solo
                </li>
                <li className="flex items-center text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2" />
                  20 depositions/month
                </li>
                <li className="flex items-center text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2" />
                  Advanced AI features
                </li>
                <li className="flex items-center text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2" />
                  Priority support
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
                  Unlimited depositions
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  Custom AI training
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  Dedicated support
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

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-300">Have questions? We have answers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Is my data secure?</h4>
              <p className="text-gray-300">Yes, we use enterprise-grade encryption and security measures to protect all your data. Our platform is fully HIPAA compliant.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">How accurate is the AI assistance?</h4>
              <p className="text-gray-300">Our AI has been trained on millions of legal documents and maintains an accuracy rate above 95% for suggestions and analysis.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Can I integrate with my existing tools?</h4>
              <p className="text-gray-300">Yes, we offer integrations with major legal software platforms and can build custom integrations for Enterprise clients.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">What support is included?</h4>
              <p className="text-gray-300">All plans include email and chat support. Small Firm and Enterprise plans include priority support with dedicated response times.</p>
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
            <Link to="/register">Get Started Today</Link>
          </Button>
          <p className="mt-4 text-gray-400">
            No credit card required. Free trial available.
          </p>
        </div>
      </div>
    </div>
  );
}