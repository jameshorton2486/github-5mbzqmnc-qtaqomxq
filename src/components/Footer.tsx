import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home,
  Info,
  Mail,
  FileText,
  Github,
  Twitter,
  Linkedin,
  HelpCircle
} from 'lucide-react';

export function Footer() {
  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="h-5 w-5" />
    },
    {
      name: 'Support',
      href: '/support',
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      name: 'About Us',
      href: '/about',
      icon: <Info className="h-5 w-5" />
    },
    {
      name: 'Contact Us',
      href: '/contact',
      icon: <Mail className="h-5 w-5" />
    }
  ];

  const social = [
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: <Github className="h-5 w-5" />
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: <Twitter className="h-5 w-5" />
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: <Linkedin className="h-5 w-5" />
    }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-8">
          {/* Brand */}
          <div className="max-w-sm">
            <Link to="/" className="flex items-center">
              <FileText className="h-8 w-8 text-purple-500" />
              <span className="ml-2 text-xl font-bold text-white">Depo-Pro</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Transforming the legal deposition process with innovated technology and unique tools for attorneys, court reporters, videographers and scopists.
            </p>
          </div>

          {/* Navigation */}
          <div className="ml-auto">
            <h4 className="text-lg font-semibold text-white mb-3">Navigation</h4>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>contact@depo-pro.com</li>
              <li>+1 (469) 386-6065</li>
              <li>7234 Hovingham</li>
              <li>San Antonio, Texas 78257</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Depo-Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}