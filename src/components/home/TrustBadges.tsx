import React from 'react';
import { Shield, Award, CheckCircle } from 'lucide-react';

export function TrustBadges() {
  return (
    <div className="py-8 border-t border-b border-gray-800 my-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center justify-center">
            <Shield className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-white">Bank-Level Security</h3>
              <p className="text-sm text-gray-400">Enterprise-grade encryption</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Award className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-white">Industry Leading</h3>
              <p className="text-sm text-gray-400">Trusted by top firms</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-white">HIPAA Compliant</h3>
              <p className="text-sm text-gray-400">Certified secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}