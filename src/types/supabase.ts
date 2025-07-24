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
      groups: {
        Row: {
          id: string
          name: string
          share_id: string
          created_at: string
          fuel_efficiency: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          share_id?: string
          created_at?: string
          fuel_efficiency?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          share_id?: string
          created_at?: string
          fuel_efficiency?: number | null
          updated_at?: string
        }
      }
      members: {
        Row: {
          id: string
          group_id: string
          name: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          name: string
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          name?: string
          joined_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          group_id: string
          amount: number
          description: string | null
          category: string
          payer_member_id: string
          paid_at: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          amount: number
          description?: string | null
          category: string
          payer_member_id: string
          paid_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          amount?: number
          description?: string | null
          category?: string
          payer_member_id?: string
          paid_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}