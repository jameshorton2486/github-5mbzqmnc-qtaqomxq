import { deepgramService } from './deepgram';

async function testDeepgramAPI() {
  console.log('🔍 Testing Deepgram API connection...');

  try {
    // Test API connection
    const isHealthy = await deepgramService.healthCheck();
    if (!isHealthy) {
      throw new Error('Failed to connect to Deepgram API');
    }

    // Test transcription with a sample audio
    console.log('\n📝 Testing transcription with sample audio...');
    const testAudioUrl = 'https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav';
    
    const response = await fetch(testAudioUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch test audio file');
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    console.log('📦 Test audio file size:', (audioBuffer.length / 1024 / 1024).toFixed(2), 'MB');
    
    const transcription = await deepgramService.transcribe(audioBuffer);
    
    const transcript = transcription.results?.channels[0]?.alternatives[0]?.transcript;
    const confidence = transcription.results?.channels[0]?.alternatives[0]?.confidence;

    console.log('\n✅ Test Results:');
    console.log('📝 Transcript:', transcript || 'No transcript available');
    console.log('🎯 Confidence:', confidence ? `${(confidence * 100).toFixed(1)}%` : 'N/A');

  } catch (error) {
    console.error('\n❌ Deepgram API test failed:', error);
    process.exit(1);
  }
}

// Run the test
console.log('🚀 Starting Deepgram API test...\n');
testDeepgramAPI().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});