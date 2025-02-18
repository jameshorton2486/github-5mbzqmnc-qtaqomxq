import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Edit, 
  GitMerge, 
  MessageSquare, 
  Clock,
  ArrowRight,
  Headphones,
  Home,
  FileText,
  Wand2,
  ClipboardCheck,
  BookOpen,
  CheckCircle,
  ListChecks
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { TranscriptSync } from './TranscriptSync';

// Sample transcript data
const sampleWords = [
  { word: "Good", start: 0, end: 0.3, confidence: 0.98 },
  { word: "morning,", start: 0.3, end: 0.6, confidence: 0.97 },
  { word: "today's", start: 0.6, end: 0.9, confidence: 0.95 },
  { word: "deposition", start: 0.9, end: 1.5, confidence: 0.99 },
  { word: "will", start: 1.5, end: 1.7, confidence: 0.98 },
  { word: "begin", start: 1.7, end: 2.0, confidence: 0.97 },
  { word: "shortly.", start: 2.0, end: 2.5, confidence: 0.96 }
];

interface Tool {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  features?: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

const tools: Tool[] = [
  {
    title: 'Live Transcript Editing',
    description: 'As the deposition unfolds, the real-time transcript can be opened directly in MS Word or Google Docs for immediate access. If a court reporter spots an error, they can edit the transcript live, reducing the need for extensive corrections after the deposition is completed. This ensures a more efficient workflow and a faster turnaround for the final transcript.',
    icon: <Edit className="h-6 w-6" />,
    link: '/features/live-editing',
    features: [
      {
        title: 'Real-time Access',
        description: 'Open transcripts directly in MS Word or Google Docs',
        icon: <FileText className="h-5 w-5" />
      },
      {
        title: 'Instant Corrections',
        description: 'Edit and correct errors in real-time',
        icon: <Edit className="h-5 w-5" />
      },
      {
        title: 'Efficient Workflow',
        description: 'Reduce post-deposition editing time',
        icon: <Clock className="h-5 w-5" />
      }
    ]
  },
  {
    title: 'Transcription from Pre-Recorded Files',
    description: 'Court reporters can generate transcripts from pre-recorded audio or video files in various formats. To enhance accuracy, the platform allows for audio preprocessing, which improves sound quality and reduces background noise. By refining the audio before transcription, court reporters can minimize errors in the rough draft, making the editing process smoother and more efficient.',
    icon: <Headphones className="h-6 w-6" />,
    link: '/features/audio-transcription',
    features: [
      {
        title: 'Multiple Format Support',
        description: 'Work with various audio and video formats',
        icon: <FileText className="h-5 w-5" />
      },
      {
        title: 'Audio Enhancement',
        description: 'Improve sound quality and reduce background noise',
        icon: <Wand2 className="h-5 w-5" />
      },
      {
        title: 'Error Reduction',
        description: 'Minimize errors in the rough draft',
        icon: <CheckCircle className="h-5 w-5" />
      }
    ]
  },
  {
    title: 'Audio-Text Sync for Quick Review',
    description: 'Instead of replaying an entire recording to find specific testimony, court reporters can click on any word or sentence in the transcript to instantly jump to that part of the audio. This feature acts like a map for the deposition, making it faster and easier to locate key moments, verify testimony, and correct errors without unnecessary playback.',
    icon: <GitMerge className="h-6 w-6" />,
    link: '/features/audio-sync',
    features: [
      {
        title: 'Interactive Playback',
        description: 'Click any word to play audio from that exact moment',
        icon: <MessageSquare className="h-5 w-5" />
      },
      {
        title: 'Visual Tracking',
        description: 'Follow along with highlighted words during playback',
        icon: <Clock className="h-5 w-5" />
      },
      {
        title: 'Quick Navigation',
        description: 'Easily jump between different parts of testimony',
        icon: <Wand2 className="h-5 w-5" />
      }
    ]
  },
  {
    title: 'Finalization & Certification',
    description: 'This section ensures the deposition transcript is reviewed, certified, and properly documented before becoming an official record.',
    icon: <FileText className="h-6 w-6" />,
    link: '/features/finalization',
    features: [
      {
        title: 'Changes & Signature Page',
        description: 'Witness review, corrections, and signature',
        icon: <ClipboardCheck className="h-5 w-5" />
      },
      {
        title: 'Notary Acknowledgment',
        description: 'Verification of witness identity and signature',
        icon: <FileText className="h-5 w-5" />
      },
      {
        title: "Reporter's Certification",
        description: 'Confirmation of accuracy, compliance, and impartiality',
        icon: <BookOpen className="h-5 w-5" />
      },
      {
        title: 'Further Certification & Chain of Custody',
        description: 'Documentation of transcript return, custody, and associated fees',
        icon: <ListChecks className="h-5 w-5" />
      },
      {
        title: 'Exhibits',
        description: 'A complete list of all marked exhibits referenced during the deposition',
        icon: <FileText className="h-5 w-5" />
      }
    ]
  }
];

export function CourtReporterPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeToolIndex, setActiveToolIndex] = useState<number | null>(null);

  const handleToolClick = (index: number) => {
    setActiveToolIndex(activeToolIndex === index ? null : index);
  };

  return (
    <div className="relative">
      {/* Home Button */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-4 right-4 z-10"
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
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="relative">
                <div className="absolute -inset-1 bg-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Brain className="relative h-12 w-12 text-purple-500 mb-6 transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">For Court Reporters</h3>
            <p className="text-gray-300 mb-6">
              Our platform provides powerful tools to streamline transcription, editing, and certification, helping court reporters save time and maintain accuracy.
            </p>

            <Link
              to="/for-court-reporters"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Learn more
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Tool Panels */}
      <div 
        className={cn(
          "grid grid-cols-1 gap-4 mt-4",
          "transition-all duration-300 ease-in-out origin-top",
          isExpanded 
            ? "opacity-100 max-h-[2000px] transform translate-y-0" 
            : "opacity-0 max-h-0 transform -translate-y-4 pointer-events-none"
        )}
      >
        {tools.map((tool, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => handleToolClick(index)}
              className={cn(
                "w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-6",
                "border border-gray-700/50 hover:border-purple-500/50",
                "transition-all duration-300 hover:bg-gray-800/70",
                "flex items-start gap-4 text-left",
                "transform hover:scale-[1.02]",
                "animate-fade-in",
                "hover:shadow-lg hover:shadow-purple-500/10",
                activeToolIndex === index && "border-purple-500/50"
              )}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="p-2 bg-purple-500/10 rounded-lg">
                {tool.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{tool.title}</h4>
                <p className="text-sm text-gray-400">{tool.description}</p>
              </div>
            </button>

            {/* Expanded Tool Content */}
            {activeToolIndex === index && (
              <div className="mt-4 animate-fade-in">
                {index === 2 ? (
                  <TranscriptSync
                    audioUrl="/sample-audio.mp3"
                    words={sampleWords}
                    className="w-full"
                  />
                ) : tool.features ? (
                  <div className="space-y-4">
                    {tool.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-purple-500/10 rounded-lg">
                            {feature.icon}
                          </div>
                          <div>
                            <h5 className="text-white font-medium mb-1">{feature.title}</h5>
                            <p className="text-sm text-gray-400">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}