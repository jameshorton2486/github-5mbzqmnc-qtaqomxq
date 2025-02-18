import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { UserTypeSelector } from '../components/UserTypeSelector';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
            Legal Depositions Done Smarter
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Depo-Pro is transforming the legal deposition process with innovative technology and unique tools tailored for attorneys, court reporters, videographers, and scopists. Our goal is to streamline workflows, enhance accuracy, and simplify depositions within the legal industry by leveraging technological solutions for all aspects of the deposition process.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              variant="primary"
              size="lg"
              icon={<ArrowRight className="h-5 w-5" />}
            >
              <Link to="/register">Get Started</Link>
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

        {/* User Type Selection */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Choose Your Role
          </h2>
          <UserTypeSelector />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-12 backdrop-blur-sm border border-purple-500/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Deposition Process?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of legal professionals who are already using our platform to streamline their depositions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
              >
                <Link to="/register">Get Started</Link>
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                icon={<Play className="h-5 w-5" />}
              >
                <Link to="/demo">Request a Demo</Link>
              </Button>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              No credit card required. Free trial available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}