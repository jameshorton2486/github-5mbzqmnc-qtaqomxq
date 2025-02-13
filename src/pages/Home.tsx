import React from 'react';
import { FileText, Mic, Brain, Clock } from 'lucide-react';

const features = [
  {
    name: 'Smart Transcription',
    description: 'Advanced AI-powered transcription with high accuracy',
    icon: <Brain className="h-6 w-6" />
  },
  {
    name: 'Multiple Sources',
    description: 'Support for YouTube videos and audio file uploads',
    icon: <Mic className="h-6 w-6" />
  },
  {
    name: 'Real-time Processing',
    description: 'Fast processing with live progress updates',
    icon: <Clock className="h-6 w-6" />
  },
  {
    name: 'Rich Text Output',
    description: 'Formatted transcripts with timestamps and speaker detection',
    icon: <FileText className="h-6 w-6" />
  }
];

export function Home() {
  return (
    <div className="py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          AI-Powered Audio Transcription
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Transform your audio and video content into accurate, formatted text with our advanced transcription service.
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative group bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur"></div>
              <div className="relative bg-gray-900 p-6 rounded-lg">
                <div className="text-purple-500 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.name}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}