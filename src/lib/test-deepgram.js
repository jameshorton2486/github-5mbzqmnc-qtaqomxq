import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../../.env') });

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

if (!DEEPGRAM_API_KEY) {
  console.error('❌ DEEPGRAM_API_KEY is not set in .env file');
  process.exit(1);
}

async function testDeepgramAPI() {
  console.log('🔍 Testing Deepgram API connection...');
  console.log('🔑 API Key:', DEEPGRAM_API_KEY.slice(0, 8) + '...');

  try {
    // Test with a simple audio transcription request
    console.log('\n📝 Testing transcription API...');
    const testAudioUrl = 'https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav';
    
    const response = await fetch('https://api.deepgram.com/v1/listen?smart_format=true', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: testAudioUrl
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API test successful!');
    console.log('📊 Transcription Result:', {
      transcript: data.results?.channels[0]?.alternatives[0]?.transcript || 'No transcript available',
      confidence: data.results?.channels[0]?.alternatives[0]?.confidence || 0
    });

  } catch (error) {
    console.error('\n❌ Deepgram API test failed:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  }
}

testDeepgramAPI().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});