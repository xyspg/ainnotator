export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          ainnotations: number | null;
          email: string | null;
          id: string;
          name: string | null;
          referer_code: string | null;
          referred_by: string | null;
        };
        Insert: {
          ainnotations?: number | null;
          email?: string | null;
          id: string;
          name?: string | null;
          referer_code?: string | null;
          referred_by?: string | null;
        };
        Update: {
          ainnotations?: number | null;
          email?: string | null;
          id?: string;
          name?: string | null;
          referer_code?: string | null;
          referred_by?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
