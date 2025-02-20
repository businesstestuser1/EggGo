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
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          user_id: string
          role_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          role_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          role_id?: string
          created_at?: string
        }
      }
      condominium_types: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      distribution_types: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      condominiums: {
        Row: {
          id: string
          name: string
          type_id: string | null
          has_lobby: boolean
          distribution_type_id: string | null
          location_lat: number | null
          location_lng: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type_id?: string | null
          has_lobby?: boolean
          distribution_type_id?: string | null
          location_lat?: number | null
          location_lng?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type_id?: string | null
          has_lobby?: boolean
          distribution_type_id?: string | null
          location_lat?: number | null
          location_lng?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customer_addresses: {
        Row: {
          id: string
          user_id: string
          condominium_id: string | null
          unit_identifier: string
          additional_details: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          condominium_id?: string | null
          unit_identifier: string
          additional_details?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          condominium_id?: string | null
          unit_identifier?: string
          additional_details?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      partner_levels: {
        Row: {
          id: string
          name: string
          min_referrals: number
          reward_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          min_referrals?: number
          reward_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          min_referrals?: number
          reward_amount?: number
          created_at?: string
        }
      }
      partner_rewards: {
        Row: {
          id: string
          partner_id: string
          referral_id: string
          amount: number
          payment_method: string
          status: string
          reward_month: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          partner_id: string
          referral_id: string
          amount: number
          payment_method?: string
          status?: string
          reward_month: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          partner_id?: string
          referral_id?: string
          amount?: number
          payment_method?: string
          status?: string
          reward_month?: string
          created_at?: string
          updated_at?: string
        }
      }
      egg_sizes: {
        Row: {
          id: string
          name: string
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_statuses: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      delivery_windows: {
        Row: {
          id: string
          condominium_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          condominium_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          condominium_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          address_id: string
          status_id: string
          delivery_window_id: string
          payment_method_id: string
          total_amount: number
          delivery_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          address_id: string
          status_id: string
          delivery_window_id: string
          payment_method_id: string
          total_amount: number
          delivery_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          address_id?: string
          status_id?: string
          delivery_window_id?: string
          payment_method_id?: string
          total_amount?: number
          delivery_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          egg_size_id: string
          quantity: number
          unit_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          egg_size_id: string
          quantity: number
          unit_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          egg_size_id?: string
          quantity?: number
          unit_price?: number
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          egg_size_id: string
          quantity: number
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          egg_size_id: string
          quantity: number
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          egg_size_id?: string
          quantity?: number
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          order_id: string
          sender_id: string
          receiver_id: string
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          sender_id: string
          receiver_id: string
          message: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          sender_id?: string
          receiver_id?: string
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
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