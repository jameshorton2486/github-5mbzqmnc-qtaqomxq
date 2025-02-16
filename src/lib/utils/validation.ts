import { z } from 'zod';

export const depositionSchema = z.object({
  case_name: z.string().min(1, 'Case name is required'),
  case_number: z.string().min(1, 'Case number is required'),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  scheduled_date: z.string().min(1, 'Date is required'),
  duration_hours: z.number().min(1, 'Duration must be at least 1 hour'),
  location: z.string().min(1, 'Location is required'),
  location_type: z.enum(['remote', 'in-person', 'hybrid']),
  platform: z.string().optional(),
  meeting_link: z.string().url().optional(),
  witness_name: z.string().min(1, 'Witness name is required'),
  witness_email: z.string().email('Invalid email address'),
  court_reporter: z.string().min(1, 'Court reporter is required'),
  attorney_name: z.string().min(1, 'Attorney name is required'),
  attorney_email: z.string().email('Invalid email address'),
  attorney_phone: z.string().min(10, 'Invalid phone number'),
  law_firm: z.string().min(1, 'Law firm is required')
});

export const sessionSchema = z.object({
  session_token: z.string().min(32, 'Invalid session token'),
  device_id: z.string().uuid().optional(),
  ip_address: z.string().ip().optional(),
  user_agent: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
});

export type DepositionInput = z.infer<typeof depositionSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;

export function validateDeposition(data: unknown): DepositionInput {
  return depositionSchema.parse(data);
}

export function validateSession(data: unknown): SessionInput {
  return sessionSchema.parse(data);
}