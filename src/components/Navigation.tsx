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
  Layout
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
    name: 'Dashboard',
    href: '/dashboard',
    icon: <Layout className="h-5 w-5" />,
    description: 'Role-specific dashboard'
  },
  {
    name: 'Cases',
    href: '/cases',
    icon: <Briefcase className="h-5 w-5" />,
    description: 'Case management',
    roles: ['attorney']
  },
  {
    name: 'Assignments',
    href: '/assignments',
    icon: <FileText className="h-5 w-5" />,
    description: 'Current assignments',
    roles: ['reporter']
  },
  {
    name: 'Recordings',
    href: '/recordings',
    icon: <Video className="h-5 w-5" />,
    description: 'Video management',
    roles: ['videographer']
  },
  {
    name: 'Transcripts',
    href: '/transcripts',
    icon: <Edit3 className="h-5 w-5" />,
    description: 'Transcript management',
    roles: ['scopist', 'reporter']
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: <Calendar className="h-5 w-5" />,
    description: 'Schedule management'
  },
  {
    name: 'History',
    href: '/history',
    icon: <History className="h-5 w-5" />,
    description: 'Activity history'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    description: 'User preferences'
  }
];

// Admin-specific navigation items
const adminNavigation: NavigationItem[] = [
  {
    name: 'User Management',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />,
    description: 'Manage system users',
    roles: ['admin']
  }
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = user?.user_metadata?.role || 'default';
  const isAdmin = userRole === 'admin';

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  // Add admin items if user is admin
  const finalNavigation = isAdmin 
    ? [...filteredNavigation, ...adminNavigation]
    : filteredNavigation;

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
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <FileText className="h-8 w-8 text-purple-500" />
                <span className="ml-2 text-xl font-bold text-white">Depo-Pro</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {finalNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200
                    ${location.pathname === item.href
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-300 hover:text-white hover:border-purple-500'
                    }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <span className="text-sm">
                  {user?.email}
                  {userRole && (
                    <span className="text-gray-400 ml-2">
                      ({userRole.charAt(0).toUpperCase() + userRole.slice(1)})
                    </span>
                  )}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
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
            {finalNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium
                  ${location.pathname === item.href
                    ? 'text-white bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  } transition-colors duration-200`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                handleSignOut();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}