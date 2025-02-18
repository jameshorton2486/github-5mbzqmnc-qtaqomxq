import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  Info,
  Search
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  roles?: string[];
  dropdown?: boolean;
  items?: {
    name: string;
    href: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
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
      { 
        name: 'Attorneys',
        href: '/for-attorneys',
        description: 'Digital exhibit management and presentation tools',
        icon: <Briefcase className="h-5 w-5" />
      },
      { 
        name: 'Court Reporters',
        href: '/for-court-reporters',
        description: 'AI-powered transcription and editing tools',
        icon: <Edit3 className="h-5 w-5" />
      },
      { 
        name: 'Videographers',
        href: '/for-videographers',
        description: 'Video synchronization and cloud storage',
        icon: <Video className="h-5 w-5" />
      },
      { 
        name: 'Scopists',
        href: '/for-scopists',
        description: 'Collaborative editing and reference tools',
        icon: <FileText className="h-5 w-5" />
      }
    ]
  },
  {
    name: 'Pricing',
    href: '/pricing',
    icon: <FileText className="h-5 w-5" />,
    description: 'Plans and pricing options'
  },
  {
    name: 'FAQs',
    href: '/faqs',
    icon: <HelpCircle className="h-5 w-5" />,
    description: 'Common questions and answers'
  },
  {
    name: 'Support',
    href: '/support',
    icon: <HelpCircle className="h-5 w-5" />,
    description: 'Get help and contact us'
  },
  {
    name: 'About Us',
    href: '/about',
    icon: <Info className="h-5 w-5" />,
    description: 'Learn more about our company'
  }
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }, [signOut, navigate]);

  const handleDropdownClick = useCallback((name: string) => {
    setDropdownOpen(prev => prev === name ? null : name);
  }, []);

  const handleNavigation = useCallback((href: string) => {
    setIsOpen(false);
    setDropdownOpen(null);
    navigate(href);
  }, [navigate]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      // Escape to close dropdowns
      if (e.key === 'Escape') {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownOpen && !e.target?.closest('.nav-dropdown')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center group"
              aria-label="Home"
            >
              <FileText className="h-8 w-8 text-purple-500 transition-transform duration-200 group-hover:scale-110" />
              <span className="ml-2 text-xl font-bold text-white">Depo-Pro</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:items-center">
            {/* Search */}
            <div className="relative mr-4">
              <input
                ref={searchRef}
                type="search"
                placeholder="Search... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-1 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative nav-dropdown">
                  {item.dropdown ? (
                    <button
                      onClick={() => handleDropdownClick(item.name)}
                      className={cn(
                        "inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200",
                        "hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900",
                        location.pathname.startsWith(item.href)
                          ? "text-white"
                          : "text-gray-300"
                      )}
                      aria-expanded={dropdownOpen === item.name}
                    >
                      {item.name}
                      <ChevronDown className={cn(
                        "ml-1 h-4 w-4 transition-transform duration-200",
                        dropdownOpen === item.name ? "rotate-180" : ""
                      )} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={cn(
                        "inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200",
                        "hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900",
                        location.pathname === item.href
                          ? "text-white"
                          : "text-gray-300"
                      )}
                    >
                      {item.name}
                    </button>
                  )}

                  {/* Mega Menu Dropdown */}
                  {item.dropdown && dropdownOpen === item.name && (
                    <div className="absolute left-0 mt-2 w-screen max-w-md rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                      <div className="p-4" role="menu">
                        {item.items?.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => handleNavigation(subItem.href)}
                            className="group flex items-start w-full p-4 text-left rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            role="menuitem"
                          >
                            {subItem.icon && (
                              <div className="flex-shrink-0 p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20">
                                {subItem.icon}
                              </div>
                            )}
                            <div className="ml-4">
                              <p className="text-sm font-medium text-white">{subItem.name}</p>
                              {subItem.description && (
                                <p className="mt-1 text-sm text-gray-400">{subItem.description}</p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sign Up/Login Button */}
            {user ? (
              <button
                onClick={handleSignOut}
                className={cn(
                  "ml-8 px-4 py-2 text-sm font-medium text-white",
                  "bg-purple-600 rounded-lg",
                  "hover:bg-purple-700 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                )}
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className={cn(
                  "ml-8 px-4 py-2 text-sm font-medium text-white",
                  "bg-purple-600 rounded-lg",
                  "hover:bg-purple-700 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                )}
              >
                Sign Up / Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-md",
                "text-gray-400 hover:text-white hover:bg-gray-700",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-purple-500"
              )}
              aria-expanded={isOpen}
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
          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => handleDropdownClick(item.name)}
                      className={cn(
                        "flex items-center w-full px-3 py-2",
                        "text-base font-medium text-gray-300",
                        "hover:text-white hover:bg-gray-700",
                        "transition-colors duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-purple-500"
                      )}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                      <ChevronDown className={cn(
                        "ml-auto h-4 w-4 transition-transform duration-200",
                        dropdownOpen === item.name ? "rotate-180" : ""
                      )} />
                    </button>
                    {dropdownOpen === item.name && (
                      <div className="pl-12 py-2 space-y-1 bg-gray-800">
                        {item.items?.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => handleNavigation(subItem.href)}
                            className={cn(
                              "flex items-center w-full px-3 py-2",
                              "text-base font-medium text-gray-300",
                              "hover:text-white hover:bg-gray-700",
                              "transition-colors duration-200",
                              "focus:outline-none focus:ring-2 focus:ring-purple-500"
                            )}
                          >
                            {subItem.icon}
                            <span className="ml-2">{subItem.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center w-full px-3 py-2",
                      "text-base font-medium text-gray-300",
                      "hover:text-white hover:bg-gray-700",
                      "transition-colors duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-purple-500"
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </button>
                )}
              </div>
            ))}
            {user ? (
              <button
                onClick={handleSignOut}
                className={cn(
                  "flex items-center w-full px-3 py-2",
                  "text-base font-medium text-gray-300",
                  "hover:text-white hover:bg-gray-700",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500"
                )}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className={cn(
                  "flex items-center w-full px-3 py-2",
                  "text-base font-medium text-gray-300",
                  "hover:text-white hover:bg-gray-700",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500"
                )}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Up / Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}