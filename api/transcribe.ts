import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ytdl from 'youtube-dl-exec';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

const DEEPGRAM_API_KEY = process.env.VITE_DEEPGRAM_API_KEY;
if (!DEEPGRAM_API_KEY) {
  throw new Error('VITE_DEEPGRAM_API_KEY environment variable is required');
}

interface CacheEntry {
  data: any;
  timestamp: number;
}

// Cache for transcriptions with TTL
const transcriptionCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of transcriptionCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      transcriptionCache.delete(key);
    }
  }
}, 60 * 60 * 1000); // Check every hour

const server = createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/transcribe') {
    try {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }
      const { url } = JSON.parse(body);

      if (!url) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'URL is required' }));
        return;
      }

      // Check cache first
      const cachedResult = transcriptionCache.get(url);
      if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ transcription: cachedResult.data }));
        return;
      }

      // Download audio from YouTube
      const outputPath = `temp-${Date.now()}.mp3`;
      try {
        await ytdl(url, {
          extractAudio: true,
          audioFormat: 'mp3',
          output: outputPath,
        });
      } catch (error) {
        console.error('YouTube download error:', error);
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Failed to download YouTube video' }));
        return;
      }

      // Read the audio file
      let audioBuffer: Buffer;
      try {
        audioBuffer = await new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          const stream = createReadStream(outputPath);
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
          stream.on('error', reject);
        });
      } catch (error) {
        console.error('File read error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to process audio file' }));
        return;
      }

      // Send to Deepgram
      try {
        const response = await fetch('https://api.deepgram.com/v1/listen?smart_format=true&summarize=true&detect_topics=true&detect_entities=true&utterances=true&paragraphs=true&detect_language=true&diarize=true', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${DEEPGRAM_API_KEY}`,
            'Content-Type': 'audio/mp3'
          },
          body: audioBuffer
        });

        if (!response.ok) {
          throw new Error(`Deepgram API error: ${response.status}`);
        }

        const transcriptionData = await response.json();
        
        // Cache the result
        transcriptionCache.set(url, {
          data: transcriptionData,
          timestamp: Date.now()
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ transcription: transcriptionData }));
      } catch (error) {
        console.error('Deepgram API error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to transcribe audio' }));
      } finally {
        // Clean up the temporary file
        try {
          await unlink(outputPath);
        } catch (error) {
          console.error('File cleanup error:', error);
        }
      }
    } catch (error) {
      console.error('General error:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});