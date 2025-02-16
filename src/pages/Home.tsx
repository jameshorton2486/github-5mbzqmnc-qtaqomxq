import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Shield, Users, Star, Video, FileText, Brain, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const features = [
  {
    title: 'For Attorneys',
    description: 'Digital exhibit management and presentation tools',
    icon: <FileText className="h-6 w-6" />,
    features: [
      'Real-time transcript review and annotation',
      'AI-powered deposition assistance',
      'Create videos from transcripts'
    ],
    role: 'attorney'
  },
  {
    title: 'For Court Reporters',
    description: 'Live and in-person transcription tools',
    icon: <Brain className="h-6 w-6" />,
    features: [
      'AI-assisted editing tools',
      'Automated formatting tools',
      'Digital signature and certification'
    ],
    role: 'reporter'
  },
  {
    title: 'For Videographers',
    description: 'Synchronized video and transcript',
    icon: <Video className="h-6 w-6" />,
    features: [
      'Cloud-based storage and delivery',
      'Quality control and timestamps',
      'Audio enhancement tools'
    ],
    role: 'videographer'
  },
  {
    title: 'For Scopists',
    description: 'Collaborative editing environment',
    icon: <Users className="h-6 w-6" />,
    features: [
      'Version control and track changes',
      'Integrated reference materials',
      'Resource library access'
    ],
    role: 'scopist'
  }
];

const additionalFeatures = [
  {
    title: 'Streamlined Scheduling',
    description: 'Intelligent calendar management with automated conflict detection',
    icon: <Calendar className="h-6 w-6" />
  },
  {
    title: 'Integrated Workflow',
    description: 'Centralized document repository for exhibits and transcripts',
    icon: <Shield className="h-6 w-6" />
  }
];

const testimonials = [
  {
    quote: "Depo-Pro has revolutionized how we handle depositions. The platform is intuitive and saves us countless hours.",
    author: "John Doe",
    role: "Senior Attorney",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200"
  },
  {
    quote: "The AI-powered features and real-time collaboration tools have transformed our workflow completely.",
    author: "Jane Smith",
    role: "Court Reporter",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200"
  },
  {
    quote: "As a videographer, the synchronized transcription and video tools are game-changing.",
    author: "Mike Johnson",
    role: "Legal Videographer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200"
  }
];

export function Home() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleRoleSelect = async (role: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: { role: role }
      });

      if (error) throw error;

      switch (role) {
        case 'attorney':
          navigate('/');
          break;
        case 'videographer':
          navigate('/');
          break;
        case 'scopist':
          navigate('/');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-8">
              Legal Depositions Done Smarter
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
              Depo-Pro is a cutting-edge legal technology platform that revolutionizes the deposition workflow, offering a seamless experience for all stakeholders in the legal discovery process.
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/register"
                className="px-8 py-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 text-lg"
              >
                Get Started <ArrowRight className="h-6 w-6" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Specific Solutions */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            Role-Specific Solutions
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Tailored tools and features designed for every professional in the deposition process
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => handleRoleSelect(feature.role)}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800 transition-colors duration-300 text-left"
              >
                <div className="text-purple-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="text-gray-300 flex items-center gap-2">
                      <Star className="h-4 w-4 text-purple-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg p-8 backdrop-blur-sm"
              >
                <div className="text-purple-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 relative"
              >
                <MessageSquare className="absolute top-6 right-6 h-8 w-8 text-purple-500/20" />
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Deposition Process?
          </h2>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors gap-2"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Depo-Pro</h3>
              <p className="text-gray-400">
                Transforming the legal deposition process with innovative technology and seamless collaboration.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@depo-pro.com</li>
                <li>+1 (469) 386-6065</li>
                <li>7234 Hovingham</li>
                <li>San Antonio, Texas 78257</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {/* Add social media icons/links here */}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            © 2025 Depo-Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}