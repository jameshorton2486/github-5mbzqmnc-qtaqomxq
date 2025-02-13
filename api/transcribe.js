import { createServer } from 'node:http';
import { createReadStream, createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import busboy from 'busboy';
import ytdl from 'youtube-dl-exec';
import ffmpeg from 'fluent-ffmpeg';

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// Get Deepgram API key from environment
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
if (!DEEPGRAM_API_KEY) {
  console.error('❌ DEEPGRAM_API_KEY is required');
  process.exit(1);
}

// Server configuration with fallback ports
const DEFAULT_PORT = 3000;
const FALLBACK_PORTS = [3001, 3002, 3003, 3004, 3005];
const SUPPORTED_FORMATS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.mp4', '.mov', '.avi', '.mkv', '.webm'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// URL validation
function validateYouTubeUrl(url) {
  try {
    const urlObj = new URL(url);
    const validHosts = ['youtube.com', 'www.youtube.com', 'youtu.be'];
    return validHosts.includes(urlObj.hostname);
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/transcribe') {
    const filesToCleanup = new Set();

    try {
      const contentType = req.headers['content-type'] || '';
      let audioBuffer;

      if (contentType.includes('multipart/form-data')) {
        audioBuffer = await handleFileUpload(req, filesToCleanup);
      } else if (contentType.includes('application/json')) {
        audioBuffer = await handleYouTubeUrl(req, filesToCleanup);
      } else {
        throw new Error('Invalid content type. Expected multipart/form-data or application/json');
      }

      console.log('🎤 Sending to Deepgram...');
      const transcriptionData = await transcribeAudio(audioBuffer);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ transcription: transcriptionData }));

    } catch (error) {
      console.error('Error:', error);
      const statusCode = error.message.includes('Invalid') ? 400 : 500;
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));

    } finally {
      // Clean up temporary files
      for (const file of filesToCleanup) {
        try {
          await unlink(file);
          console.log(`✅ Cleaned up: ${file}`);
        } catch (error) {
          console.error(`❌ Failed to clean up ${file}:`, error);
        }
      }
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

async function handleFileUpload(req, filesToCleanup) {
  return new Promise((resolve, reject) => {
    const bb = busboy({ 
      headers: req.headers,
      limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1
      }
    });

    bb.on('file', async (name, file, info) => {
      const ext = extname(info.filename).toLowerCase();
      if (!SUPPORTED_FORMATS.includes(ext)) {
        reject(new Error(`Invalid file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`));
        return;
      }

      const tempPath = `temp-${Date.now()}-${info.filename}`;
      filesToCleanup.add(tempPath);
      
      const writeStream = createWriteStream(tempPath);
      file.pipe(writeStream);

      writeStream.on('finish', async () => {
        try {
          const buffer = await processAudioFile(tempPath, filesToCleanup);
          resolve(buffer);
        } catch (error) {
          reject(error);
        }
      });

      writeStream.on('error', reject);
    });

    bb.on('error', reject);
    bb.on('limit', () => reject(new Error(`File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`)));
    
    req.pipe(bb);
  });
}

async function handleYouTubeUrl(req, filesToCleanup) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const { url } = JSON.parse(Buffer.concat(chunks).toString());

  if (!url) {
    throw new Error('URL is required');
  }

  if (!validateYouTubeUrl(url)) {
    throw new Error('Invalid YouTube URL');
  }

  const outputPath = `temp-${Date.now()}.mp3`;
  filesToCleanup.add(outputPath);

  try {
    await ytdl(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: outputPath,
    });

    return await streamToBuffer(createReadStream(outputPath));
  } catch (error) {
    if (error.message.includes('Video unavailable')) {
      throw new Error('YouTube video is unavailable or private');
    }
    throw error;
  }
}

async function transcribeAudio(audioBuffer) {
  console.log('📊 Audio buffer size:', (audioBuffer.length / 1024 / 1024).toFixed(2), 'MB');
  
  const response = await fetch('https://api.deepgram.com/v1/listen?smart_format=true&summarize=true&detect_topics=true&detect_entities=true&utterances=true&paragraphs=true&detect_language=true&diarize=true', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${DEEPGRAM_API_KEY}`,
      'Content-Type': 'audio/mp3'
    },
    body: audioBuffer
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('❌ Deepgram API error:', {
      status: response.status,
      error: errorData
    });
    throw new Error(`Deepgram API error: ${errorData}`);
  }

  const data = await response.json();
  console.log('✅ Transcription successful');
  return data;
}

async function processAudioFile(inputPath, filesToCleanup) {
  const outputPath = `${inputPath}.mp3`;
  filesToCleanup.add(outputPath);
  
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });

  return await streamToBuffer(createReadStream(outputPath));
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Try to start server on available port
async function startServer(port) {
  try {
    server.listen(port);
    console.log(`
🚀 Server running on port ${port}
📝 API endpoint: http://localhost:${port}/api/transcribe
📦 Max file size: ${MAX_FILE_SIZE / 1024 / 1024}MB
    `);
    return true;
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} is in use, trying next port...`);
      return false;
    }
    throw error;
  }
}

async function findAvailablePort() {
  const requestedPort = parseInt(process.env.PORT || DEFAULT_PORT, 10);
  const ports = [requestedPort, ...FALLBACK_PORTS];

  for (const port of ports) {
    const success = await startServer(port);
    if (success) return;
  }

  console.error('❌ No available ports found');
  process.exit(1);
}

// Start server with port fallback
findAvailablePort();