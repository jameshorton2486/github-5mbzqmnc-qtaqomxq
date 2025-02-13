import React, { useState, useRef } from 'react';
import { Youtube, Loader2, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
}

interface TranscriptionResponse {
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
        words: Word[];
        summaries?: Array<{ text: string }>;
        topics?: Array<{ topic: string }>;
      }>;
    }>;
  };
}

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcription, setTranscription] = useState<TranscriptionResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to transcribe video');
      }
      
      const data = await response.json();
      setTranscription(data.transcription);

      // Save to Supabase if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('transcriptions').insert({
          user_id: user.id,
          youtube_url: youtubeUrl,
          transcript_data: data.transcription
        });
      }

      if (audioRef.current) {
        audioRef.current.src = youtubeUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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

  const jumpToTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12 p-6">
          <h1 className="text-4xl font-bold">Transcribe</h1>
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent text-4xl font-bold">
            Preexisting Audio Files
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex gap-4">
            <input
              type="url"
              required
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter YouTube URL..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Processing...
                </>
              ) : (
                'Transcribe'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {transcription && (
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Transcription</h2>
                <button
                  onClick={togglePlayPause}
                  className="p-2 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors"
                >
                  {isPlaying ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="prose prose-invert max-w-none">
                {transcription.results.channels[0].alternatives[0].words.map((word, index) => (
                  <span
                    key={index}
                    onClick={() => jumpToTime(word.start)}
                    className="cursor-pointer hover:bg-purple-500/20 px-1 rounded transition-colors"
                    style={{ opacity: word.confidence }}
                  >
                    {word.word}{' '}
                  </span>
                ))}
              </div>
            </div>

            {transcription.results.channels[0].alternatives[0].summaries && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <p className="text-gray-300">
                  {transcription.results.channels[0].alternatives[0].summaries[0].text}
                </p>
              </div>
            )}

            {transcription.results.channels[0].alternatives[0].topics && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-4">Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {transcription.results.channels[0].alternatives[0].topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-200"
                    >
                      {topic.topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}