import { supabase } from '../supabase';
import { z } from 'zod';

const activitySchema = z.object({
  type: z.string(),
  metadata: z.record(z.unknown()).optional()
});

export type SessionActivity = z.infer<typeof activitySchema>;

interface SessionAnalytics {
  total_sessions: number;
  active_sessions: number;
  total_activities: number;
  unique_devices: number;
  last_active: string;
  most_used_device: {
    id: string;
    name: string;
    type: string;
    last_used: string;
  };
}

export async function trackSessionActivity(activity: SessionActivity) {
  try {
    // Validate activity data
    activitySchema.parse(activity);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.rpc('track_session_activity', {
      p_session_id: session.access_token,
      p_activity_type: activity.type,
      p_metadata: {
        ...activity.metadata,
        user_agent: navigator.userAgent,
        screen_size: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to track session activity:', error);
    throw error;
  }
}

export async function getSessionAnalytics(days: number = 30): Promise<SessionAnalytics> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase.rpc('get_session_analytics', {
      p_user_id: user.id,
      p_days: days
    });

    if (error) throw error;
    return data as SessionAnalytics;
  } catch (error) {
    console.error('Failed to get session analytics:', error);
    throw error;
  }
}

export async function clearInactiveSessions() {
  try {
    const { error } = await supabase.rpc('cleanup_inactive_sessions', {
      p_hours: 24
    });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to clear inactive sessions:', error);
    throw error;
  }
}