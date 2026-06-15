export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      todos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          note: string;
          due_date: string | null;
          reminder_time: string | null;
          priority: 'low' | 'medium' | 'high';
          category_id: string | null;
          completed: boolean;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          note?: string;
          due_date?: string | null;
          reminder_time?: string | null;
          priority?: 'low' | 'medium' | 'high';
          category_id?: string | null;
          completed?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          note?: string;
          due_date?: string | null;
          reminder_time?: string | null;
          priority?: 'low' | 'medium' | 'high';
          category_id?: string | null;
          completed?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'todos_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      todo_tags: {
        Row: {
          todo_id: string;
          tag_id: string;
        };
        Insert: {
          todo_id: string;
          tag_id: string;
        };
        Update: {
          todo_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'todo_tags_todo_id_fkey';
            columns: ['todo_id'];
            isOneToOne: false;
            referencedRelation: 'todos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'todo_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
        ];
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
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
