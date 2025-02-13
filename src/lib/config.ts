import { z } from 'zod';

// Define environment schema with Zod for runtime validation
const envSchema = z.object({
  supabase: z.object({
    primary: z.object({
      url: z.string().url('Invalid primary Supabase URL'),
      anonKey: z.string().min(20, 'Invalid primary Supabase anonymous key'),
    }),
    secondary: z.object({
      url: z.string().url('Invalid secondary Supabase URL'),
      anonKey: z.string().min(20, 'Invalid secondary Supabase anonymous key'),
    }),
  }),
  deepgram: z.object({
    apiKey: z.string().min(20, 'Invalid Deepgram API key'),
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
        primary: {
          url: import.meta.env.VITE_SUPABASE_URL,
          anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        secondary: {
          url: import.meta.env.VITE_SUPABASE_SECONDARY_URL,
          anonKey: import.meta.env.VITE_SUPABASE_SECONDARY_ANON_KEY,
        },
      },
      deepgram: {
        apiKey: import.meta.env.VITE_DEEPGRAM_API_KEY,
      },
      server: {
        port: parseInt(import.meta.env.PORT || '3000', 10),
        host: import.meta.env.HOST || 'localhost',
        isDev: import.meta.env.NODE_ENV !== 'production',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error('❌ Unexpected error during environment validation:', error);
    }
    throw new Error('Invalid environment configuration');
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

// Validate configuration on import
console.log('✅ Configuration validated successfully');