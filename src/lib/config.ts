import { z } from 'zod';

// Define environment schema with Zod for runtime validation
const envSchema = z.object({
  supabase: z.object({
    url: z.string().optional(),
    anonKey: z.string().optional(),
  }),
  deepgram: z.object({
    apiKey: z.string().optional(),
  }),
  server: z.object({
    port: z.number().int().positive(),
    host: z.string(),
    isDev: z.boolean(),
  }),
});

// Type inference from schema
type Config = z.infer<typeof envSchema>;

function validateEnvironment(): Config {
  try {
    return envSchema.parse({
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      deepgram: {
        apiKey: import.meta.env.VITE_DEEPGRAM_API_KEY,
      },
      server: {
        port: parseInt(import.meta.env.PORT || '3000', 10),
        host: import.meta.env.HOST || 'localhost',
        isDev: import.meta.env.DEV || false,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('⚠️ Environment validation warnings:');
      error.errors.forEach((err) => {
        console.warn(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.warn('⚠️ Unexpected error during environment validation:', error);
    }
    // Return default development configuration
    return {
      supabase: {
        url: undefined,
        anonKey: undefined,
      },
      deepgram: {
        apiKey: undefined,
      },
      server: {
        port: 3000,
        host: 'localhost',
        isDev: true,
      },
    };
  }
}

// Export validated configuration
export const config = validateEnvironment();

// Type-safe config getter
export function getConfig<T extends keyof Config>(
  key: T,
  subKey?: keyof Config[T]
): subKey extends keyof Config[T] ? Config[T][subKey] : Config[T] {
  if (subKey) {
    return config[key][subKey as keyof Config[T]] as any;
  }
  return config[key] as any;
}

console.log('✅ Configuration loaded successfully');