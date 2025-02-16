export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      depositions: {
        Row: {
          id: string
          user_id: string
          case_name: string
          case_number: string
          jurisdiction: string
          scheduled_date: string
          duration_hours: number
          location: string
          location_type: 'remote' | 'in-person' | 'hybrid'
          platform: string | null
          meeting_link: string | null
          witness_name: string
          witness_title: string | null
          witness_email: string
          witness_phone: string | null
          court_reporter: string
          videographer: string | null
          interpreter_required: boolean
          interpreter_language: string | null
          exhibits_expected: boolean
          exhibit_delivery_method: string | null
          court_order_file_path: string | null
          attorney_name: string
          attorney_email: string
          attorney_phone: string
          law_firm: string
          notes: string | null
          status: 'scheduled' | 'completed' | 'cancelled'
          is_recurring: boolean
          recurrence_pattern: Json | null
          series_id: string | null
          original_deposition_id: string | null
          notification_preferences: Json
          billing_info: Json
          custom_fields: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          case_name: string
          case_number: string
          jurisdiction: string
          scheduled_date: string
          duration_hours: number
          location: string
          location_type: 'remote' | 'in-person' | 'hybrid'
          platform?: string | null
          meeting_link?: string | null
          witness_name: string
          witness_title?: string | null
          witness_email: string
          witness_phone?: string | null
          court_reporter: string
          videographer?: string | null
          interpreter_required?: boolean
          interpreter_language?: string | null
          exhibits_expected?: boolean
          exhibit_delivery_method?: string | null
          court_order_file_path?: string | null
          attorney_name: string
          attorney_email: string
          attorney_phone: string
          law_firm: string
          notes?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled'
          is_recurring?: boolean
          recurrence_pattern?: Json | null
          series_id?: string | null
          original_deposition_id?: string | null
          notification_preferences?: Json
          billing_info?: Json
          custom_fields?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          case_name?: string
          case_number?: string
          jurisdiction?: string
          scheduled_date?: string
          duration_hours?: number
          location?: string
          location_type?: 'remote' | 'in-person' | 'hybrid'
          platform?: string | null
          meeting_link?: string | null
          witness_name?: string
          witness_title?: string | null
          witness_email?: string
          witness_phone?: string | null
          court_reporter?: string
          videographer?: string | null
          interpreter_required?: boolean
          interpreter_language?: string | null
          exhibits_expected?: boolean
          exhibit_delivery_method?: string | null
          court_order_file_path?: string | null
          attorney_name?: string
          attorney_email?: string
          attorney_phone?: string
          law_firm?: string
          notes?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled'
          is_recurring?: boolean
          recurrence_pattern?: Json | null
          series_id?: string | null
          original_deposition_id?: string | null
          notification_preferences?: Json
          billing_info?: Json
          custom_fields?: Json
          created_at?: string
          updated_at?: string
        }
      }
      deposition_participants: {
        Row: {
          id: string
          deposition_id: string
          user_id: string | null
          role: string
          name: string
          email: string
          phone: string | null
          organization: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deposition_id: string
          user_id?: string | null
          role: string
          name: string
          email: string
          phone?: string | null
          organization?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deposition_id?: string
          user_id?: string | null
          role?: string
          name?: string
          email?: string
          phone?: string | null
          organization?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      clone_deposition: {
        Args: {
          deposition_id: string
          new_date: string
        }
        Returns: string
      }
    }
    Enums: {
      deposition_location_type: 'remote' | 'in-person' | 'hybrid'
      deposition_status: 'scheduled' | 'completed' | 'cancelled'
    }
  }
}