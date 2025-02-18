import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowRight, 
  MessageSquare, 
  Search,
  Video,
  Database,
  Home
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface Tool {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const tools: Tool[] = [
  {
    title: 'Real-time Transcript Review',
    description: 'Review and annotate transcripts instantly during proceedings',
    icon: <FileText className="h-6 w-6" />,
    link: '/features/transcript-review'
  },
  {
    title: 'AI-Powered Assistance',
    description: 'Smart tools for efficient deposition management',
    icon: <MessageSquare className="h-6 w-6" />,
    link: '/features/ai-assistance'
  },
  {
    title: 'Exhibit Management',
    description: 'Securely manage digital exhibits with version control',
    icon: <Database className="h-6 w-6" />,
    link: '/features/exhibit-management'
  },
  {
    title: 'Video Integration',
    description: 'Create compelling video presentations from transcripts',
    icon: <Video className="h-6 w-6" />,
    link: '/features/video-integration'
  }
];

export function AttorneyPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent panel expansion
    navigate('/');
  };

  const handleToolClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation(); // Prevent panel expansion
    navigate(link);
  };

  return (
    <div className="relative">
      {/* Home Button - Fixed Position */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-4 right-4 z-10"
        onClick={handleHomeClick}
        icon={<Home className="h-5 w-5" />}
      >
        Home
      </Button>

      {/* Main Panel */}
      <div 
        className={cn(
          "group bg-gray-800/50 backdrop-blur-sm rounded-lg p-8",
          "border border-gray-700/50 hover:border-purple-500/50",
          "transition-all duration-300 hover:bg-gray-800/70",
          "cursor-pointer",
          isExpanded && "border-purple-500/50 bg-gray-800/70"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex gap-8">
          {/* Left Column - Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="relative">
                <div className="absolute -inset-1 bg-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FileText className="relative h-12 w-12 text-purple-500 mb-6 transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">For Attorneys</h3>
            <p className="text-gray-300 mb-6">
              Digital exhibit management and presentation tools designed specifically for legal professionals.
            </p>

            <button
              onClick={(e) => handleToolClick(e, '/for-attorneys')}
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Learn more
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Column - Image */}
          <div className="hidden lg:block w-1/3">
            <img
              src="https://images.unsplash.com/photo-1593115057322-e94b77572f20?auto=format&fit=crop&w=500&h=300&q=80"
              alt="Attorneys at conference table"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Expandable Tool Panels */}
      <div 
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4",
          "transition-all duration-300 ease-in-out origin-top",
          isExpanded 
            ? "opacity-100 max-h-[500px] transform translate-y-0" 
            : "opacity-0 max-h-0 transform -translate-y-4 pointer-events-none"
        )}
      >
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={(e) => handleToolClick(e, tool.link)}
            className={cn(
              "bg-gray-800/50 backdrop-blur-sm rounded-lg p-6",
              "border border-gray-700/50 hover:border-purple-500/50",
              "transition-all duration-300 hover:bg-gray-800/70",
              "flex items-start gap-4 w-full text-left",
              "transform hover:scale-[1.02]",
              "animate-fade-in",
              "hover:shadow-lg hover:shadow-purple-500/10"
            )}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="p-2 bg-purple-500/10 rounded-lg">
              {tool.icon}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">{tool.title}</h4>
              <p className="text-sm text-gray-400">{tool.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Search Bar - Appears when expanded */}
      <div 
        className={cn(
          "absolute -bottom-4 left-1/2 -translate-x-1/2",
          "transition-all duration-300 ease-in-out",
          isExpanded 
            ? "opacity-100 transform translate-y-0" 
            : "opacity-0 transform translate-y-4 pointer-events-none"
        )}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search attorney tools..."
            className={cn(
              "w-64 px-4 py-2 pl-10 rounded-full",
              "bg-gray-900/90 backdrop-blur-sm",
              "border border-gray-700 focus:border-purple-500",
              "text-white placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            )}
            onClick={(e) => e.stopPropagation()}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}