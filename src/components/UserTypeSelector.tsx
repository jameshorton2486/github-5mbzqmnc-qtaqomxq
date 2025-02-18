import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Brain, 
  Video, 
  Users,
  ArrowRight,
  Star,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';

interface UserType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

const userTypes: UserType[] = [
  {
    id: 'attorney',
    title: 'For Attorneys',
    description: 'Digital exhibit management and presentation tools designed specifically for legal professionals.',
    icon: <FileText className="h-8 w-8" />,
    color: 'purple',
    href: '/for-attorneys',
    features: [
      {
        icon: <FileText className="h-5 w-5" />,
        title: 'Digital Exhibit Management',
        description: 'Organize and present exhibits seamlessly during depositions.'
      },
      {
        icon: <Brain className="h-5 w-5" />,
        title: 'AI-Powered Assistance',
        description: 'Get real-time insights and suggestions during depositions.'
      },
      {
        icon: <Video className="h-5 w-5" />,
        title: 'Video Integration',
        description: 'Create compelling video presentations from transcripts.'
      }
    ]
  },
  {
    id: 'court-reporter',
    title: 'For Court Reporters',
    description: 'Streamline your workflow with our comprehensive suite of tools designed specifically for court reporters.',
    icon: <Brain className="h-8 w-8" />,
    color: 'blue',
    href: '/for-court-reporters',
    features: [
      {
        icon: <FileText className="h-5 w-5" />,
        title: 'Live Transcript Editing',
        description: 'Edit transcripts in real-time with instant corrections.'
      },
      {
        icon: <Star className="h-5 w-5" />,
        title: 'Real-Time Collaboration',
        description: 'Work seamlessly with scopists and proofreaders.'
      },
      {
        icon: <Brain className="h-5 w-5" />,
        title: 'AI-Assisted Editing',
        description: 'Reduce editing time with intelligent assistance.'
      }
    ]
  },
  {
    id: 'videographer',
    title: 'For Videographers',
    description: 'Deliver high-quality, synchronized videos with AI-powered enhancements and cloud-based storage.',
    icon: <Video className="h-8 w-8" />,
    color: 'pink',
    href: '/for-videographers',
    features: [
      {
        icon: <Video className="h-5 w-5" />,
        title: 'Cloud Storage',
        description: 'Secure cloud storage with instant delivery options.'
      },
      {
        icon: <Star className="h-5 w-5" />,
        title: 'Quality Control',
        description: 'AI-powered quality control for perfect synchronization.'
      },
      {
        icon: <FileText className="h-5 w-5" />,
        title: 'Audio Enhancement',
        description: 'Professional tools for crystal-clear sound.'
      }
    ]
  },
  {
    id: 'scopist',
    title: 'For Scopists',
    description: 'Collaborate efficiently with version control, track changes, and integrated reference materials.',
    icon: <Users className="h-8 w-8" />,
    color: 'green',
    href: '/for-scopists',
    features: [
      {
        icon: <FileText className="h-5 w-5" />,
        title: 'Version Control',
        description: 'Track changes with advanced version control.'
      },
      {
        icon: <Star className="h-5 w-5" />,
        title: 'Reference Library',
        description: 'Access comprehensive reference materials.'
      },
      {
        icon: <Users className="h-5 w-5" />,
        title: 'Collaboration',
        description: 'Work seamlessly with court reporters.'
      }
    ]
  }
];

export function UserTypeSelector() {
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const panelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expandedPanel) {
        const panel = panelRefs.current[expandedPanel];
        if (panel && !panel.contains(event.target as Node)) {
          setExpandedPanel(null);
        }
      }
    };

    if (expandedPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedPanel]);

  const handlePanelClick = (id: string) => {
    setExpandedPanel(expandedPanel === id ? null : id);
  };

  const handleLearnMore = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(href);
  };

  const colorVariants = {
    purple: {
      bg: 'hover:bg-purple-500/10',
      border: 'hover:border-purple-500/50',
      icon: 'text-purple-500',
      glow: 'bg-purple-500/20'
    },
    blue: {
      bg: 'hover:bg-blue-500/10',
      border: 'hover:border-blue-500/50',
      icon: 'text-blue-500',
      glow: 'bg-blue-500/20'
    },
    pink: {
      bg: 'hover:bg-pink-500/10',
      border: 'hover:border-pink-500/50',
      icon: 'text-pink-500',
      glow: 'bg-pink-500/20'
    },
    green: {
      bg: 'hover:bg-green-500/10',
      border: 'hover:border-green-500/50',
      icon: 'text-green-500',
      glow: 'bg-green-500/20'
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {userTypes.map((type) => {
        const isExpanded = expandedPanel === type.id;
        const colors = colorVariants[type.color];

        return (
          <div
            key={type.id}
            ref={el => panelRefs.current[type.id] = el}
            className="relative"
          >
            <button
              onClick={() => handlePanelClick(type.id)}
              className={cn(
                'w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-8',
                'border border-gray-700/50',
                'transition-all duration-300 ease-in-out',
                'hover:shadow-lg',
                colors.bg,
                colors.border,
                isExpanded && 'shadow-lg'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={cn(
                      'absolute -inset-2 rounded-full blur-lg opacity-0 transition-opacity duration-300',
                      colors.glow,
                      isExpanded && 'opacity-100'
                    )} />
                    <div className={cn(
                      'relative p-2 rounded-lg transition-transform duration-300',
                      colors.icon,
                      isExpanded && 'scale-110'
                    )}>
                      {type.icon}
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-white">{type.title}</h3>
                    <p className="text-gray-400">{type.description}</p>
                  </div>
                </div>
                <ChevronDown 
                  className={cn(
                    'h-5 w-5 text-gray-400 transition-transform duration-300',
                    isExpanded && 'rotate-180'
                  )}
                />
              </div>
            </button>

            <div
              className={cn(
                'overflow-hidden transition-all duration-500 ease-in-out origin-top',
                isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="space-y-4 p-4">
                {type.features.map((feature, index) => (
                  <div
                    key={index}
                    className={cn(
                      'bg-gray-800/30 backdrop-blur-sm rounded-lg p-6',
                      'border border-gray-700/50',
                      'transition-all duration-300',
                      'animate-fade-in'
                    )}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'p-3 rounded-lg',
                        colors.bg,
                        colors.icon
                      )}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">{feature.title}</h4>
                        <p className="text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <button
                    onClick={(e) => handleLearnMore(e, type.href)}
                    className={cn(
                      'inline-flex items-center font-medium',
                      'transition-colors duration-300',
                      `text-${type.color}-400 hover:text-${type.color}-300`
                    )}
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}