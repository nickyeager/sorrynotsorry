export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      games: {
        Row: {
          id: string
          game_type: 'singles' | 'doubles'
          location: string | null
          wager_amount: number
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          team1_score: number | null
          team2_score: number | null
          winner_team: 1 | 2 | null
          created_by: string
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          game_type: 'singles' | 'doubles'
          location?: string | null
          wager_amount?: number
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          team1_score?: number | null
          team2_score?: number | null
          winner_team?: 1 | 2 | null
          created_by: string
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          game_type?: 'singles' | 'doubles'
          location?: string | null
          wager_amount?: number
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          team1_score?: number | null
          team2_score?: number | null
          winner_team?: 1 | 2 | null
          created_by?: string
          created_at?: string
          completed_at?: string | null
        }
      }
      game_players: {
        Row: {
          id: string
          game_id: string
          player_id: string
          team: 1 | 2
        }
        Insert: {
          id?: string
          game_id: string
          player_id: string
          team: 1 | 2
        }
        Update: {
          id?: string
          game_id?: string
          player_id?: string
          team?: 1 | 2
        }
      }
      ledger_entries: {
        Row: {
          id: string
          game_id: string
          from_player: string
          to_player: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          from_player: string
          to_player: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          from_player?: string
          to_player?: string
          amount?: number
          created_at?: string
        }
      }
      settlements: {
        Row: {
          id: string
          from_player: string
          to_player: string
          amount: number
          note: string | null
          settled_at: string
        }
        Insert: {
          id?: string
          from_player: string
          to_player: string
          amount: number
          note?: string | null
          settled_at?: string
        }
        Update: {
          id?: string
          from_player?: string
          to_player?: string
          amount?: number
          note?: string | null
          settled_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_by?: string
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
