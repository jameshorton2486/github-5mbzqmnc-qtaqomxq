import React, { useState, useRef } from 'react';
import { Youtube, Upload, Loader2 } from 'lucide-react';
import { deepgramService } from '../lib/deepgram';

interface TranscriptionFormProps {
  onTranscriptionComplete: (data: any) => void;
  onError: (error: Error) => void;
}

export function TranscriptionForm({ onTranscriptionComplete, onError }: TranscriptionFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let audioBuffer: Buffer;

      if (uploadMode === 'url') {
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: youtubeUrl })
        });

        if (!response.ok) {
          throw new Error('Failed to download audio from YouTube');
        }

        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = Buffer.from(arrayBuffer);
      } else if (selectedFile) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        audioBuffer = Buffer.from(arrayBuffer);
      } else {
        throw new Error('No file or URL provided');
      }

      const transcription = await deepgramService.transcribe(audioBuffer);
      onTranscriptionComplete(transcription);
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Failed to transcribe audio'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`flex-1 p-4 rounded-lg ${
            uploadMode === 'url' ? 'bg-purple-600' : 'bg-gray-800'
          }`}
        >
          <Youtube className="mx-auto h-6 w-6 mb-2" />
          <span>YouTube URL</span>
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`flex-1 p-4 rounded-lg ${
            uploadMode === 'file' ? 'bg-purple-600' : 'bg-gray-800'
          }`}
        >
          <Upload className="mx-auto h-6 w-6 mb-2" />
          <span>Upload File</span>
        </button>
      </div>

      {uploadMode === 'url' ? (
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="Enter YouTube URL..."
          className="w-full p-3 bg-gray-800 rounded-lg"
          required
        />
      ) : (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setSelectedFile(e.files?.[0] || null)}
            accept="audio/*,video/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 bg-gray-800 rounded-lg text-left"
          >
            {selectedFile ? selectedFile.name : 'Choose a file...'}
          </button>
        </>
      )}

      <button
        type="submit"
        disabled={loading || (!youtubeUrl && !selectedFile)}
        className="w-full p-3 bg-purple-600 rounded-lg disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="animate-spin mx-auto h-5 w-5" />
        ) : (
          'Start Transcription'
        )}
      </button>
    </form>
  );
}