import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Trash2, Download } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Transcription = Database['public']['Tables']['transcriptions']['Row'];

export function History() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  async function fetchTranscriptions() {
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTranscriptions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transcriptions');
    } finally {
      setLoading(false);
    }
  }

  async function deleteTranscription(id: string) {
    try {
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTranscriptions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transcription');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Transcription History</h1>

      {transcriptions.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No transcriptions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transcriptions.map((transcription) => (
            <div
              key={transcription.id}
              className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {transcription.youtube_url || transcription.file_name || 'Untitled'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {new Date(transcription.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {/* Implement download */}}
                    className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteTranscription(transcription.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}