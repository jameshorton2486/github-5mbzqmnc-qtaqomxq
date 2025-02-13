import { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'youtube-dl-exec';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
if (!DEEPGRAM_API_KEY) {
  throw new Error('DEEPGRAM_API_KEY environment variable is required');
}

// Cache for transcriptions with TTL
const transcriptionCache = new Map();
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Check cache first
    const cachedResult = transcriptionCache.get(url);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      return res.status(200).json({ transcription: cachedResult.data });
    }

    const outputPath = `temp-${Date.now()}.mp3`;
    await ytdl(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: outputPath,
    });

    const audioBuffer = await new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const stream = createReadStream(outputPath);
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });

    const response = await fetch('https://api.deepgram.com/v1/listen?smart_format=true&summarize=true&detect_topics=true&detect_entities=true&utterances=true&paragraphs=true&detect_language=true&diarize=true', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/mp3'
      },
      body: audioBuffer as Buffer
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const transcriptionData = await response.json();
    
    // Cache the result with timestamp
    transcriptionCache.set(url, {
      data: transcriptionData,
      timestamp: Date.now()
    });

    // Clean up the temporary file
    await unlink(outputPath);

    res.status(200).json({ transcription: transcriptionData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}