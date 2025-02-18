import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Home,
  FileText,
  History, 
  Settings, 
  LogOut,
  Video,
  Edit3,
  Briefcase,
  Users,
  Calendar,
  Layout,
  HelpCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  roles?: string[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: <Home className="h-5 w-5" />,
    description: 'Overview and key information'
  },
  {
    name: 'Solutions',
    href: '/solutions',
    icon: <Users className="h-5 w-5" />,
    dropdown: true,
    items: [
      { name: 'Attorneys', href: '/for-attorneys' },
      { name: 'Court Reporters', href: '/for-court-reporters' },
      { name: 'Videographers', href: '/for-videographers' },
      { name: 'Scopists', href: '/for-scopists' }
    ]
  },
  {
    name: 'Pricing',
    href: '/pricing',
    icon: <FileText className="h-5 w-5" />
  },
  {
    name: 'FAQs',
    href: '/faqs',
    icon: <HelpCircle className="h-5 w-5" />
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
  }
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <FileText className="h-8 w-8 text-purple-500" />
              <span className="ml-2 text-xl font-bold text-white">Depo-Pro</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:items-center">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === item.name ? null : item.name)}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200
                        ${location.pathname.startsWith(item.href)
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                        }`}
                    >
                      {item.name}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        dropdownOpen === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200
                        ${location.pathname === item.href
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                        }`}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Dropdown menu */}
                  {item.dropdown && dropdownOpen === item.name && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                            role="menuitem"
                            onClick={() => setDropdownOpen(null)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sign Up/Login Button */}
            <button
              onClick={() => navigate('/login')}
              className="ml-8 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              Sign Up / Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === item.name ? null : item.name)}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                      <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                        dropdownOpen === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {dropdownOpen === item.name && (
                      <div className="pl-12 py-2 space-y-1 bg-gray-800">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => {
                              setDropdownOpen(null);
                              setIsOpen(false);
                            }}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
            <Link
              to="/login"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Up / Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}