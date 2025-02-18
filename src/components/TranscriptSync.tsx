import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, FastForward, Rewind } from 'lucide-react';
import { cn } from '../lib/utils';

interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
}

interface TranscriptSyncProps {
  audioUrl: string;
  words: Word[];
  onTimeUpdate?: (time: number) => void;
  className?: string;
}

export function TranscriptSync({ audioUrl, words, onTimeUpdate, className }: TranscriptSyncProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Update active word based on current time
  useEffect(() => {
    const currentWord = words.findIndex(
      word => currentTime >= word.start && currentTime <= word.end
    );
    
    if (currentWord !== activeWordIndex) {
      setActiveWordIndex(currentWord);
      
      // Scroll active word into view
      if (currentWord >= 0 && transcriptRef.current && highlightRef.current) {
        const wordElement = highlightRef.current;
        const container = transcriptRef.current;
        
        const wordTop = wordElement.offsetTop;
        const wordBottom = wordTop + wordElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.offsetHeight;
        
        if (wordTop < containerTop || wordBottom > containerBottom) {
          container.scrollTo({
            top: wordTop - container.offsetHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [currentTime, words, activeWordIndex]);

  // Handle audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  // Jump to specific word
  const handleWordClick = (index: number) => {
    if (audioRef.current && words[index]) {
      audioRef.current.currentTime = words[index].start;
      setCurrentTime(words[index].start);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Playback controls
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  return (
    <div className={cn("bg-gray-800 rounded-lg overflow-hidden", className)}>
      {/* Audio Controls */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-4">
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-white" />
          ) : (
            <Play className="h-6 w-6 text-white" />
          )}
        </button>

        <button
          onClick={skipBackward}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Rewind className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={skipForward}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <FastForward className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-gray-400" />
          ) : (
            <Volume2 className="h-5 w-5 text-gray-400" />
          )}
        </button>

        <select
          value={playbackRate}
          onChange={(e) => changePlaybackRate(Number(e.target.value))}
          className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
        >
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>

        <div className="text-sm text-gray-400">
          {new Date(currentTime * 1000).toISOString().substr(14, 5)} / 
          {audioRef.current?.duration
            ? new Date(audioRef.current.duration * 1000).toISOString().substr(14, 5)
            : '00:00'}
        </div>
      </div>

      {/* Transcript Display */}
      <div 
        ref={transcriptRef}
        className="h-[400px] overflow-y-auto p-6 space-y-4"
      >
        {words.map((word, index) => (
          <span
            key={index}
            ref={index === activeWordIndex ? highlightRef : null}
            onClick={() => handleWordClick(index)}
            className={cn(
              "inline-block cursor-pointer transition-all duration-200",
              "hover:bg-purple-500/20 rounded px-1",
              index === activeWordIndex && "bg-purple-500/40 text-white",
              word.confidence < 0.8 && "text-yellow-400",
              word.confidence < 0.6 && "text-red-400"
            )}
            style={{
              opacity: Math.max(0.5, word.confidence)
            }}
          >
            {word.word}{' '}
          </span>
        ))}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}