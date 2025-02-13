import { z } from 'zod';

const configSchema = z.object({
  apiKey: z.string().min(1, 'Deepgram API key is required')
});

const config = {
  apiKey: import.meta.env.VITE_DEEPGRAM_API_KEY
};

const validatedConfig = configSchema.parse(config);

interface DeepgramOptions {
  smartFormat?: boolean;
  summarize?: boolean;
  detectTopics?: boolean;
  detectEntities?: boolean;
  utterances?: boolean;
  paragraphs?: boolean;
  detectLanguage?: boolean;
  diarize?: boolean;
}

export class DeepgramService {
  private static instance: DeepgramService;
  private retryCount = 3;
  private retryDelay = 1000;

  private constructor() {}

  static getInstance(): DeepgramService {
    if (!DeepgramService.instance) {
      DeepgramService.instance = new DeepgramService();
    }
    return DeepgramService.instance;
  }

  private buildUrl(options: DeepgramOptions = {}): string {
    const params = new URLSearchParams({
      smart_format: String(options.smartFormat ?? true),
      summarize: String(options.summarize ?? true),
      detect_topics: String(options.detectTopics ?? true),
      detect_entities: String(options.detectEntities ?? true),
      utterances: String(options.utterances ?? true),
      paragraphs: String(options.paragraphs ?? true),
      detect_language: String(options.detectLanguage ?? true),
      diarize: String(options.diarize ?? true),
    });

    return `https://api.deepgram.com/v1/listen?${params}`;
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries = this.retryCount
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await new Promise(resolve => 
          setTimeout(resolve, this.retryDelay * (this.retryCount - retries + 1))
        );
        return this.retryWithBackoff(operation, retries - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    return error.message.includes('timeout') || 
           error.message.includes('network') ||
           (error.status && [408, 429, 502, 503, 504].includes(error.status));
  }

  async transcribe(audioBuffer: Buffer, options?: DeepgramOptions) {
    return this.retryWithBackoff(async () => {
      const response = await fetch(this.buildUrl(options), {
        method: 'POST',
        headers: {
          'Authorization': `Token ${validatedConfig.apiKey}`,
          'Content-Type': 'audio/mp3'
        },
        body: audioBuffer
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Deepgram API error: ${errorData.error || response.statusText}`);
      }

      return response.json();
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch('https://api.deepgram.com/v1/projects', {
        headers: {
          'Authorization': `Token ${validatedConfig.apiKey}`,
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const deepgramService = DeepgramService.getInstance();